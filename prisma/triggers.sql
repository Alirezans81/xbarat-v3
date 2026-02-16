-- =========================================================
-- Wallet / Liquidity / Exchange Triggers
-- Compatible with current Prisma schema (TEXT ids)
-- =========================================================

-- ---------------------------------------------------------
-- Helper: generate UUID-like TEXT id without extensions.
-- (avoids requiring pgcrypto / uuid-ossp privileges)
-- ---------------------------------------------------------
DROP FUNCTION IF EXISTS generate_text_uuid();

CREATE FUNCTION generate_text_uuid()
RETURNS TEXT AS $$
SELECT lower(
  substr(md5(random()::text || clock_timestamp()::text), 1, 8) || '-' ||
  substr(md5(random()::text || clock_timestamp()::text), 1, 4) || '-' ||
  '4' || substr(md5(random()::text || clock_timestamp()::text), 1, 3) || '-' ||
  substr('89ab', 1 + floor(random() * 4)::int, 1) || substr(md5(random()::text || clock_timestamp()::text), 1, 3) || '-' ||
  substr(md5(random()::text || clock_timestamp()::text), 1, 12)
);
$$ LANGUAGE sql VOLATILE;

-- ===========================
-- 1) Create wallets on new user
-- ===========================
DROP TRIGGER IF EXISTS trigger_create_wallets_on_user ON "User";
DROP FUNCTION IF EXISTS create_wallets_for_new_user();

CREATE FUNCTION create_wallets_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO "Wallet" (
    id,
    "userId",
    "currencyId",
    balance,
    frozen,
    "createdAt",
    "updatedAt"
  )
  SELECT
    generate_text_uuid(),
    NEW.id,
    c.id,
    0.00,
    0.00,
    NOW(),
    NOW()
  FROM "Currency" c
  ON CONFLICT ("userId", "currencyId") DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_wallets_on_user
AFTER INSERT ON "User"
FOR EACH ROW
EXECUTE FUNCTION create_wallets_for_new_user();

-- ===========================
-- 2) Create wallets on new currency
-- ===========================
DROP TRIGGER IF EXISTS trigger_create_wallets_on_currency ON "Currency";
DROP FUNCTION IF EXISTS create_wallets_for_new_currency();

CREATE FUNCTION create_wallets_for_new_currency()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO "Wallet" (
    id,
    "userId",
    "currencyId",
    balance,
    frozen,
    "createdAt",
    "updatedAt"
  )
  SELECT
    generate_text_uuid(),
    u.id,
    NEW.id,
    0.00,
    0.00,
    NOW(),
    NOW()
  FROM "User" u
  ON CONFLICT ("userId", "currencyId") DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_wallets_on_currency
AFTER INSERT ON "Currency"
FOR EACH ROW
EXECUTE FUNCTION create_wallets_for_new_currency();

-- ===========================
-- 3) Deposit: credit on COMPLETED transition
-- ===========================
DROP TRIGGER IF EXISTS deposit_completed_trigger ON "Deposit";
DROP FUNCTION IF EXISTS update_balances_on_deposit();

CREATE FUNCTION update_balances_on_deposit()
RETURNS TRIGGER AS $$
DECLARE
  liquidity_pool_id TEXT;
BEGIN
  IF NEW.status = 'COMPLETED' AND OLD.status IS DISTINCT FROM 'COMPLETED' THEN
    UPDATE "Wallet"
    SET balance = balance + NEW.amount,
        "updatedAt" = NOW()
    WHERE id = NEW."walletId";

    SELECT "liquidityPoolId"
    INTO liquidity_pool_id
    FROM "BridgeTransfer"
    WHERE "depositId" = NEW.id
    LIMIT 1;

    IF liquidity_pool_id IS NOT NULL THEN
      UPDATE "LiquidityPool"
      SET balance = balance + NEW.amount,
          "updatedAt" = NOW()
      WHERE id = liquidity_pool_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deposit_completed_trigger
AFTER UPDATE OF status ON "Deposit"
FOR EACH ROW
EXECUTE FUNCTION update_balances_on_deposit();

-- ===========================
-- 4) Withdrawal
-- - BEFORE INSERT: reserve amount in frozen
-- - AFTER DELETE: refund reserved amount if not completed
-- - AFTER UPDATE status: finalize or refund
-- ===========================
DROP TRIGGER IF EXISTS update_balances_on_create_withdrawal_trigger ON "Withdrawal";
DROP FUNCTION IF EXISTS update_balances_on_create_withdrawal();

CREATE FUNCTION update_balances_on_create_withdrawal()
RETURNS TRIGGER AS $$
DECLARE
  w_balance NUMERIC;
BEGIN
  IF NEW.status IN ('PENDING', 'AWAITING_PAYMENT', 'APPROVAL') THEN
    SELECT balance
    INTO w_balance
    FROM "Wallet"
    WHERE id = NEW."walletId"
    FOR UPDATE;

    IF w_balance IS NULL THEN
      RAISE EXCEPTION 'Wallet % not found', NEW."walletId";
    END IF;

    IF w_balance < NEW.amount THEN
      RAISE EXCEPTION 'Insufficient balance for withdrawal (have: %, need: %)', w_balance, NEW.amount;
    END IF;

    UPDATE "Wallet"
    SET balance = balance - NEW.amount,
        frozen = frozen + NEW.amount,
        "updatedAt" = NOW()
    WHERE id = NEW."walletId";
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_balances_on_create_withdrawal_trigger
BEFORE INSERT ON "Withdrawal"
FOR EACH ROW
EXECUTE FUNCTION update_balances_on_create_withdrawal();

DROP TRIGGER IF EXISTS update_balances_on_delete_withdrawal_trigger ON "Withdrawal";
DROP FUNCTION IF EXISTS update_balances_on_delete_withdrawal();

CREATE FUNCTION update_balances_on_delete_withdrawal()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM 'COMPLETED' THEN
    UPDATE "Wallet"
    SET balance = balance + OLD.amount,
        frozen = GREATEST(frozen - OLD.amount, 0),
        "updatedAt" = NOW()
    WHERE id = OLD."walletId";
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_balances_on_delete_withdrawal_trigger
AFTER DELETE ON "Withdrawal"
FOR EACH ROW
EXECUTE FUNCTION update_balances_on_delete_withdrawal();

DROP TRIGGER IF EXISTS withdrawal_completed_trigger ON "Withdrawal";
DROP FUNCTION IF EXISTS update_balances_on_withdrawal();

CREATE FUNCTION update_balances_on_withdrawal()
RETURNS TRIGGER AS $$
DECLARE
  liquidity_pool_id TEXT;
BEGIN
  IF NEW.status = 'COMPLETED' AND OLD.status IS DISTINCT FROM 'COMPLETED' THEN
    UPDATE "Wallet"
    SET frozen = GREATEST(frozen - NEW.amount, 0),
        "updatedAt" = NOW()
    WHERE id = NEW."walletId";

    SELECT "liquidityPoolId"
    INTO liquidity_pool_id
    FROM "BridgeTransfer"
    WHERE "withdrawalId" = NEW.id
    LIMIT 1;

    IF liquidity_pool_id IS NOT NULL THEN
      UPDATE "LiquidityPool"
      SET frozen = GREATEST(frozen - NEW.amount, 0),
          "updatedAt" = NOW()
      WHERE id = liquidity_pool_id;
    END IF;
  END IF;

  IF NEW.status IN ('FAILED', 'REJECTED') AND OLD.status NOT IN ('FAILED', 'REJECTED') THEN
    UPDATE "Wallet"
    SET balance = balance + NEW.amount,
        frozen = GREATEST(frozen - NEW.amount, 0),
        "updatedAt" = NOW()
    WHERE id = NEW."walletId";
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER withdrawal_completed_trigger
AFTER UPDATE OF status ON "Withdrawal"
FOR EACH ROW
EXECUTE FUNCTION update_balances_on_withdrawal();

-- ===========================
-- 5) Exchange
-- - BEFORE INSERT: reserve fromAmount and deduct fee
-- - AFTER UPDATE remainingAmount: apply matched delta
-- - AFTER UPDATE status: finalize or refund
-- ===========================
DROP TRIGGER IF EXISTS trigger_wallet_on_update ON "Exchange";
DROP FUNCTION IF EXISTS wallet_update_on_create_exchange();

CREATE FUNCTION wallet_update_on_create_exchange()
RETURNS TRIGGER AS $$
DECLARE
  from_currency_id TEXT;
  to_currency_id TEXT;
  cur_balance NUMERIC;
  required_total NUMERIC;
BEGIN
  SELECT "fromCurrencyId", "toCurrencyId"
  INTO from_currency_id, to_currency_id
  FROM "CurrencyPair"
  WHERE id = NEW."currencyPairId";

  IF from_currency_id IS NULL OR to_currency_id IS NULL THEN
    RAISE EXCEPTION 'CurrencyPair % is invalid', NEW."currencyPairId";
  END IF;

  required_total := NEW."fromAmount" + COALESCE(NEW.fee, 0.00);

  SELECT balance
  INTO cur_balance
  FROM "Wallet"
  WHERE "userId" = NEW."userId" AND "currencyId" = from_currency_id
  FOR UPDATE;

  IF cur_balance IS NULL THEN
    RAISE EXCEPTION 'Wallet not found for user % and currency %', NEW."userId", from_currency_id;
  END IF;

  IF cur_balance < required_total THEN
    RAISE EXCEPTION 'Insufficient balance: have %, need % (fromAmount + fee)', cur_balance, required_total;
  END IF;

  UPDATE "Wallet"
  SET balance = balance - required_total,
      frozen = frozen + NEW."fromAmount",
      "updatedAt" = NOW()
  WHERE "userId" = NEW."userId" AND "currencyId" = from_currency_id;

  IF NEW."remainingAmount" IS NULL OR NEW."remainingAmount" = 0 THEN
    NEW."remainingAmount" := NEW."fromAmount";
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_wallet_on_update
BEFORE INSERT ON "Exchange"
FOR EACH ROW
EXECUTE FUNCTION wallet_update_on_create_exchange();

DROP TRIGGER IF EXISTS trigger_wallet_on_exchange_change_remaining_amount ON "Exchange";
DROP FUNCTION IF EXISTS wallet_update_on_exchange_change_remaining_amount();

CREATE FUNCTION wallet_update_on_exchange_change_remaining_amount()
RETURNS TRIGGER AS $$
DECLARE
  from_currency_id TEXT;
  to_currency_id TEXT;
  is_inverse BOOLEAN;
  delta NUMERIC;
  credit_amount NUMERIC;
BEGIN
  SELECT "fromCurrencyId", "toCurrencyId", "isInverseRate"
  INTO from_currency_id, to_currency_id, is_inverse
  FROM "CurrencyPair"
  WHERE id = NEW."currencyPairId";

  delta := COALESCE(OLD."remainingAmount", 0) - COALESCE(NEW."remainingAmount", 0);
  IF delta <= 0 THEN
    RETURN NEW;
  END IF;

  UPDATE "Wallet"
  SET frozen = GREATEST(frozen - delta, 0),
      "updatedAt" = NOW()
  WHERE "userId" = NEW."userId" AND "currencyId" = from_currency_id;

  IF is_inverse THEN
    credit_amount := delta / NEW."exchangeRate";
  ELSE
    credit_amount := delta * NEW."exchangeRate";
  END IF;

  UPDATE "Wallet"
  SET balance = balance + credit_amount,
      "updatedAt" = NOW()
  WHERE "userId" = NEW."userId" AND "currencyId" = to_currency_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_wallet_on_exchange_change_remaining_amount
AFTER UPDATE OF "remainingAmount" ON "Exchange"
FOR EACH ROW
EXECUTE FUNCTION wallet_update_on_exchange_change_remaining_amount();

DROP TRIGGER IF EXISTS trigger_wallet_on_exchange_status_change ON "Exchange";
DROP FUNCTION IF EXISTS wallet_handle_exchange_status_change();

CREATE FUNCTION wallet_handle_exchange_status_change()
RETURNS TRIGGER AS $$
DECLARE
  from_currency_id TEXT;
  fee_wallet_id TEXT;
  fee_amount NUMERIC;
BEGIN
  SELECT "fromCurrencyId"
  INTO from_currency_id
  FROM "CurrencyPair"
  WHERE id = NEW."currencyPairId";

  fee_amount := COALESCE(NEW.fee, 0.00);

  IF NEW.status = 'COMPLETED' AND OLD.status IS DISTINCT FROM 'COMPLETED' THEN
    UPDATE "Wallet"
    SET frozen = GREATEST(frozen - COALESCE(NEW."remainingAmount", 0), 0),
        "updatedAt" = NOW()
    WHERE "userId" = NEW."userId" AND "currencyId" = from_currency_id;

    IF fee_amount > 0 THEN
      SELECT w.id
      INTO fee_wallet_id
      FROM "FeeUser" fu
      JOIN "Wallet" w ON w."userId" = fu."userId"
      WHERE fu."isActive" = true AND w."currencyId" = from_currency_id
      ORDER BY fu."updatedAt" DESC, fu."createdAt" DESC
      LIMIT 1;

      IF fee_wallet_id IS NOT NULL THEN
        UPDATE "Wallet"
        SET balance = balance + fee_amount,
            "updatedAt" = NOW()
        WHERE id = fee_wallet_id;
      END IF;
    END IF;
  END IF;

  IF NEW.status IN ('FAILED', 'CANCELED') AND OLD.status NOT IN ('FAILED', 'CANCELED') THEN
    UPDATE "Wallet"
    SET balance = balance + COALESCE(NEW."remainingAmount", 0) + fee_amount,
        frozen = GREATEST(frozen - COALESCE(NEW."remainingAmount", 0), 0),
        "updatedAt" = NOW()
    WHERE "userId" = NEW."userId" AND "currencyId" = from_currency_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_wallet_on_exchange_status_change
AFTER UPDATE OF status ON "Exchange"
FOR EACH ROW
EXECUTE FUNCTION wallet_handle_exchange_status_change();

-- End of script
