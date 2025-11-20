-- prerequisite: gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================
-- 1) create wallets for new user
-- ============================
DROP TRIGGER IF EXISTS trigger_create_wallets_on_user ON "User";
DROP FUNCTION IF EXISTS create_wallets_for_new_user();

CREATE OR REPLACE FUNCTION create_wallets_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- create a wallet (one per currency) for the new user if not exists
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
    gen_random_uuid(),
    NEW.id,
    c.id,
    0.00,
    0.00,
    NOW(),
    NOW()
  FROM "Currency" c
  -- avoid duplicate insertion if unique constraint already present (race-safety)
  ON CONFLICT ("userId", "currencyId") DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_wallets_on_user
AFTER INSERT ON "User"
FOR EACH ROW
EXECUTE FUNCTION create_wallets_for_new_user();


-- ============================
-- 2) create wallets for new currency
-- ============================
DROP TRIGGER IF EXISTS trigger_create_wallets_on_currency ON "Currency";
DROP FUNCTION IF EXISTS create_wallets_for_new_currency();

CREATE OR REPLACE FUNCTION create_wallets_for_new_currency()
RETURNS TRIGGER AS $$
BEGIN
  -- create wallet for each existing user for the new currency if not exists
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
    gen_random_uuid(),
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


-- ============================
-- 3) Deposit: when status -> COMPLETED
-- ============================
DROP TRIGGER IF EXISTS deposit_completed_trigger ON "Deposit";
DROP FUNCTION IF EXISTS update_balances_on_deposit();

CREATE OR REPLACE FUNCTION update_balances_on_deposit()
RETURNS TRIGGER AS $$
DECLARE
  liquidity_pool_id TEXT;
BEGIN
  -- run only on transitions to COMPLETED
  IF NEW.status = 'COMPLETED' AND (OLD.status IS DISTINCT FROM 'COMPLETED') THEN
    -- credit the wallet linked to this deposit (walletId exists in schema)
    UPDATE "Wallet"
    SET balance = balance + NEW.amount,
        "updatedAt" = NOW()
    WHERE id = NEW."walletId";

    -- if there's a BridgeTransfer linking this deposit to a liquidity pool, credit that pool
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

    -- set completedAt if not set (optional, but helpful)
    IF NEW.completedAt IS NULL THEN
      UPDATE "Deposit"
      SET "completedAt" = NOW()
      WHERE id = NEW.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deposit_completed_trigger
AFTER UPDATE OF status ON "Deposit"
FOR EACH ROW
EXECUTE FUNCTION update_balances_on_deposit();


-- ============================
-- 4) Withdrawal: when inserted (PENDING) and when status changes
--  - BEFORE INSERT: reserve funds (ensure sufficient balance)
--  - AFTER DELETE: if removal before completion -> refund
--  - AFTER UPDATE status -> finalize or refund on FAILED/REJECTED/COMPLETED
-- ============================
DROP TRIGGER IF EXISTS update_balances_on_create_withdrawal_trigger ON "Withdrawal";
DROP FUNCTION IF EXISTS update_balances_on_create_withdrawal();

CREATE OR REPLACE FUNCTION update_balances_on_create_withdrawal()
RETURNS TRIGGER AS $$
DECLARE
  w_balance NUMERIC;
BEGIN
  -- This BEFORE INSERT trigger ensures user has enough available balance and reserves amount.
  IF NEW.status = 'PENDING' OR NEW.status = 'AWAITING_PAYMENT' OR NEW.status = 'APPROVAL' THEN
    SELECT balance INTO w_balance
    FROM "Wallet"
    WHERE id = NEW."walletId"
    FOR UPDATE;

    IF w_balance IS NULL THEN
      RAISE EXCEPTION 'Wallet % not found', NEW."walletId";
    END IF;

    IF w_balance < NEW.amount THEN
      RAISE EXCEPTION 'Insufficient balance for withdrawal (have: %, need: %)', w_balance, (NEW.amount);
    END IF;

    -- subtract fee immediately and move amount to frozen
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

CREATE OR REPLACE FUNCTION update_balances_on_delete_withdrawal()
RETURNS TRIGGER AS $$
BEGIN
  -- If a withdrawal row is deleted but it was not completed, refund amount+fee and unfreeze
  IF OLD.status IS DISTINCT FROM 'COMPLETED' THEN
    UPDATE "Wallet"
    SET balance = balance + COALESCE(OLD.fee, 0.00) + OLD.amount,
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

CREATE OR REPLACE FUNCTION update_balances_on_withdrawal()
RETURNS TRIGGER AS $$
DECLARE
  liquidity_pool_id TEXT;
BEGIN
  -- transition to COMPLETED: remove frozen amount (it was already subtracted from balance on creation)
  IF NEW.status = 'COMPLETED' AND (OLD.status IS DISTINCT FROM 'COMPLETED') THEN
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

    IF NEW.completedAt IS NULL THEN
      UPDATE "Withdrawal" SET "completedAt" = NOW() WHERE id = NEW.id;
    END IF;
  END IF;

  -- transition to FAILED/REJECTED: refund amount + fee (if fee was taken at creation)
  IF NEW.status IN ('FAILED', 'REJECTED') AND (OLD.status NOT IN ('FAILED', 'REJECTED')) THEN
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


-- ============================
-- 5) Exchange: BEFORE INSERT (validation + reserve funds), 
--    AFTER UPDATE OF "remainingAmount" (apply matched amounts), 
--    AFTER UPDATE OF status (finalize / refund / fee transfer)
-- ============================
DROP TRIGGER IF EXISTS trigger_wallet_on_update ON "Exchange";
DROP FUNCTION IF EXISTS wallet_update_on_create_exchange();

CREATE OR REPLACE FUNCTION wallet_update_on_create_exchange()
RETURNS TRIGGER AS $$
DECLARE
  new_from_currency_id TEXT;
  new_to_currency_id TEXT;
  cur_balance NUMERIC;
  required_total NUMERIC;
BEGIN
  -- read currency ids from CurrencyPair
  SELECT "fromCurrencyId", "toCurrencyId"
  INTO new_from_currency_id, new_to_currency_id
  FROM "CurrencyPair"
  WHERE id = NEW."currencyPairId";

  IF new_from_currency_id IS NULL OR new_to_currency_id IS NULL THEN
    RAISE EXCEPTION 'CurrencyPair % is invalid', NEW."currencyPairId";
  END IF;

  -- calculate total required (we assume fee is in fromCurrency and must be available immediately)
  required_total := NEW."fromAmount";

  -- lock the wallet row
  SELECT balance INTO cur_balance
  FROM "Wallet"
  WHERE "userId" = NEW."userId" AND "currencyId" = new_from_currency_id
  FOR UPDATE;

  IF cur_balance IS NULL THEN
    RAISE EXCEPTION 'Wallet not found for user % and currency %', NEW."userId", new_from_currency_id;
  END IF;

  IF cur_balance < required_total THEN
    RAISE EXCEPTION 'Insufficient balance: have % need % (fromAmount)', cur_balance, required_total;
  END IF;

  -- deduct fee immediately from balance, deduct fromAmount from balance and put fromAmount into frozen
  -- (fee won't be in frozen; fee will be transferred to FeeUser on completion)
  UPDATE "Wallet"
  SET balance = balance - NEW."fromAmount",
      frozen = frozen + NEW."fromAmount",
      "updatedAt" = NOW()
  WHERE "userId" = NEW."userId" AND "currencyId" = new_from_currency_id;

  -- ensure remainingAmount is set (if application didn't set it)
  IF NEW."remainingAmount" IS NULL OR NEW."remainingAmount" = 0 THEN
    NEW."remainingAmount" := NEW."fromAmount"; -- default
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_wallet_on_update
BEFORE INSERT ON "Exchange"
FOR EACH ROW
EXECUTE FUNCTION wallet_update_on_create_exchange();


-- Handle when remainingAmount decreases (some portion was matched/executed)
DROP TRIGGER IF EXISTS trigger_wallet_on_exchange_change_remaining_amount ON "Exchange";
DROP FUNCTION IF EXISTS wallet_update_on_exchange_change_remaining_amount();

CREATE OR REPLACE FUNCTION wallet_update_on_exchange_change_remaining_amount()
RETURNS TRIGGER AS $$
DECLARE
  new_from_currency_id TEXT;
  new_to_currency_id TEXT;
  is_inverse BOOLEAN;
  delta NUMERIC;
  credit_amount NUMERIC;
BEGIN
  -- read pair info
  SELECT "fromCurrencyId", "toCurrencyId", "isInverseRate"
  INTO new_from_currency_id, new_to_currency_id, is_inverse
  FROM "CurrencyPair"
  WHERE id = NEW."currencyPairId";

  -- if remainingAmount didn't decrease, nothing to do
  delta := COALESCE(OLD."remainingAmount", 0) - COALESCE(NEW."remainingAmount", 0);

  IF delta <= 0 THEN
    RETURN NEW;
  END IF;

  -- unfreeze the matched amount from 'from' wallet (the matched portion is consumed; we reduce frozen)
  UPDATE "Wallet"
  SET frozen = GREATEST(frozen - delta, 0),
      "updatedAt" = NOW()
  WHERE "userId" = NEW."userId" AND "currencyId" = new_from_currency_id;

  -- credit the corresponding 'to' wallet with delta * rate (or delta / rate if inverse)
  IF is_inverse THEN
    -- rate stored is inverse: toAmount = fromAmount / rate
    credit_amount := (delta / NEW."exchangeRate");
  ELSE
    credit_amount := (delta * NEW."exchangeRate");
  END IF;

  UPDATE "Wallet"
  SET balance = balance + credit_amount,
      "updatedAt" = NOW()
  WHERE "userId" = NEW."userId" AND "currencyId" = new_to_currency_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_wallet_on_exchange_change_remaining_amount
AFTER UPDATE OF "remainingAmount" ON "Exchange"
FOR EACH ROW
EXECUTE FUNCTION wallet_update_on_exchange_change_remaining_amount();


-- Handle Exchange status transitions (COMPLETED, FAILED, CANCELED)
DROP TRIGGER IF EXISTS trigger_wallet_on_exchange_status_change ON "Exchange";
DROP FUNCTION IF EXISTS wallet_handle_exchange_status_change();

CREATE OR REPLACE FUNCTION wallet_handle_exchange_status_change()
RETURNS TRIGGER AS $$
DECLARE
  from_currency_id TEXT;
  fee_wallet_id TEXT;
  refund_amount NUMERIC;
BEGIN
  -- read currency pair
  SELECT "fromCurrencyId" INTO from_currency_id
  FROM "CurrencyPair"
  WHERE id = NEW."currencyPairId";

  -- 1) Completed: remaining frozen should be released (if any) and fee transferred to active FeeUser (if exists)
  IF NEW.status = 'COMPLETED' AND (OLD.status IS DISTINCT FROM 'COMPLETED') THEN
    -- release any leftover frozen (usually remainingAmount should be 0)
    UPDATE "Wallet"
    SET frozen = GREATEST(frozen - COALESCE(NEW."remainingAmount", 0) - COALESCE(NEW.fee, 0.00), 0),
        "updatedAt" = NOW()
    WHERE "userId" = NEW."userId" AND "currencyId" = from_currency_id;

    -- transfer fee to active FeeUser wallet (if any)
    IF COALESCE(NEW.fee, 0.00) > 0 THEN
      SELECT w.id
      INTO fee_wallet_id
      FROM "FeeUser" fu
      JOIN "User" u ON u.id = fu."userId"
      JOIN "Wallet" w ON u.id = w."userId"
      WHERE fu."isActive" = true AND w."currencyId" = from_currency_id
      LIMIT 1;

      IF fee_wallet_id IS NOT NULL THEN
        UPDATE "Wallet"
        SET balance = balance + NEW.fee,
            "updatedAt" = NOW()
        WHERE id = fee_wallet_id;
      ELSE
        -- if there's no FeeUser, you might want to send fees to a platform wallet; currently we leave fee deducted from user balance.
        NULL;
      END IF;
    END IF;
  END IF;

  -- 2) FAILED or CANCELED: refund remainingAmount and the fee (if fee was deducted at creation)
  IF NEW.status IN ('FAILED', 'CANCELED') AND (OLD.status NOT IN ('FAILED', 'CANCELED')) THEN
    -- refund remainingAmount to balance and remove it from frozen
    UPDATE "Wallet"
    SET balance = balance + COALESCE(NEW."remainingAmount", 0),
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


-- ============================
-- 6) Transfer fee on Exchange completion (redundant with above? kept for clarity)
--    (the above status handler already transfers fee to FeeUser when Exchange -> COMPLETED)
-- ============================
-- (No extra trigger needed; handled in wallet_handle_exchange_status_change)

-- End of script
