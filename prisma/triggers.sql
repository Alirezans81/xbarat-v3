DROP TRIGGER IF EXISTS trigger_create_wallets_on_user ON "User";
DROP FUNCTION IF EXISTS create_wallets_for_new_user();

CREATE OR REPLACE FUNCTION create_wallets_for_new_user()
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
    gen_random_uuid(),
    NEW.id,
    c.id,
    0.00,
    0.00,
    NOW(),
    NOW()
  FROM "Currency" c;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_wallets_on_user
AFTER INSERT ON "User"
FOR EACH ROW
EXECUTE FUNCTION create_wallets_for_new_user();


DROP TRIGGER IF EXISTS trigger_create_wallets_on_currency ON "Currency";
DROP FUNCTION IF EXISTS create_wallets_for_new_currency();

CREATE OR REPLACE FUNCTION create_wallets_for_new_currency()
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
    gen_random_uuid(),
    u.id,
    NEW.id,
    0.00,
    0.00,
    NOW(),
    NOW()
  FROM "User" u;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_wallets_on_currency
AFTER INSERT ON "Currency"
FOR EACH ROW
EXECUTE FUNCTION create_wallets_for_new_currency();


DROP TRIGGER IF EXISTS deposit_completed_trigger ON "Deposit";
DROP FUNCTION IF EXISTS update_balances_on_deposit();

CREATE OR REPLACE FUNCTION update_balances_on_deposit()
RETURNS TRIGGER AS $$
DECLARE
  liquidity_pool_id TEXT;
BEGIN
  IF NEW.status = 'COMPLETED' AND OLD.status IS DISTINCT FROM 'COMPLETED' THEN
    UPDATE "Wallet"
    SET balance = balance + NEW.amount - NEW.fee
    WHERE id = NEW."walletId";

    SELECT "liquidityPoolId"
    INTO liquidity_pool_id
    FROM "BridgeTransfer"
    WHERE "depositId" = NEW.id
    LIMIT 1;

    IF liquidity_pool_id IS NOT NULL THEN
      UPDATE "LiquidityPool"
      SET balance = balance + NEW.amount
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


DROP TRIGGER IF EXISTS trigger_wallet_on_update ON "Exchange";
DROP FUNCTION IF EXISTS wallet_update_on_create_exchange();

CREATE OR REPLACE FUNCTION wallet_update_on_create_exchange()
RETURNS TRIGGER AS $$
DECLARE
  new_from_currency_id TEXT;
  new_to_currency_id TEXT;
  current_balance NUMERIC;
BEGIN
  SELECT "fromCurrencyId", "toCurrencyId"
  INTO new_from_currency_id, new_to_currency_id
  FROM "CurrencyPair"
  WHERE id = NEW."currencyPairId";

  SELECT balance INTO current_balance
  FROM "Wallet"
  WHERE "userId" = NEW."userId" AND "currencyId" = new_from_currency_id
  FOR UPDATE;

  IF current_balance < NEW."fromAmount" THEN
    RAISE EXCEPTION 'Insufficient balance: % < %', current_balance, NEW."fromAmount";
  END IF;

  UPDATE "Wallet"
  SET balance = balance - NEW."fromAmount",
      frozen = frozen + NEW."fromAmount"
  WHERE "userId" = NEW."userId" AND "currencyId" = new_from_currency_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_wallet_on_update
BEFORE INSERT ON "Exchange"
FOR EACH ROW
EXECUTE FUNCTION wallet_update_on_create_exchange();


DROP TRIGGER IF EXISTS trigger_wallet_on_exchange_change_remaining_amount ON "Exchange";
DROP FUNCTION IF EXISTS wallet_update_on_exchange_change_remaining_amount();

CREATE OR REPLACE FUNCTION wallet_update_on_exchange_change_remaining_amount()
RETURNS TRIGGER AS $$
DECLARE
  new_from_currency_id TEXT;
  new_to_currency_id TEXT;
  is_inverse BOOLEAN;
  delta NUMERIC;
BEGIN
  SELECT "fromCurrencyId", "toCurrencyId", "isInverseRate"
  INTO new_from_currency_id, new_to_currency_id, is_inverse
  FROM "CurrencyPair"
  WHERE id = NEW."currencyPairId";

  delta := OLD."remainingAmount" - NEW."remainingAmount";

  IF delta <= 0 THEN
    RETURN NEW;
  END IF;

  UPDATE "Wallet"
  SET frozen = GREATEST(frozen - delta, 0)
  WHERE "userId" = NEW."userId" AND "currencyId" = new_from_currency_id;

  IF is_inverse THEN
    UPDATE "Wallet"
    SET balance = balance + (delta / NEW."exchangeRate")
    WHERE "userId" = NEW."userId" AND "currencyId" = new_to_currency_id;
  ELSE
    UPDATE "Wallet"
    SET balance = balance + (delta * NEW."exchangeRate")
    WHERE "userId" = NEW."userId" AND "currencyId" = new_to_currency_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_wallet_on_exchange_change_remaining_amount
AFTER UPDATE OF "remainingAmount" ON "Exchange"
FOR EACH ROW
EXECUTE FUNCTION wallet_update_on_exchange_change_remaining_amount();


DROP TRIGGER IF EXISTS update_balances_on_create_withdrawal_trigger ON "Withdrawal";
DROP FUNCTION IF EXISTS update_balances_on_create_withdrawal();

CREATE OR REPLACE FUNCTION update_balances_on_create_withdrawal()
RETURNS TRIGGER AS $$
DECLARE
  liquidity_pool_id TEXT;
BEGIN
  IF NEW.status = 'PENDING' THEN
    UPDATE "Wallet"
    SET frozen = frozen + NEW.amount
    WHERE id = NEW."walletId";

    SELECT "liquidityPoolId"
    INTO liquidity_pool_id
    FROM "BridgeTransfer"
    WHERE "withdrawalId" = NEW.id
    LIMIT 1;

    IF liquidity_pool_id IS NOT NULL THEN
      UPDATE "LiquidityPool"
      SET frozen = frozen + NEW.amount
      WHERE id = liquidity_pool_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_balances_on_create_withdrawal_trigger
AFTER INSERT ON "Withdrawal"
FOR EACH ROW
EXECUTE FUNCTION update_balances_on_create_withdrawal();


DROP TRIGGER IF EXISTS update_balances_on_delete_withdrawal_trigger ON "Withdrawal";
DROP FUNCTION IF EXISTS update_balances_on_delete_withdrawal();

CREATE OR REPLACE FUNCTION update_balances_on_delete_withdrawal()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM 'COMPLETED' THEN
    UPDATE "Wallet"
    SET balance = balance + OLD.amount + OLD.fee,
        frozen = GREATEST(frozen - OLD.amount, 0)
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
  IF NEW.status = 'COMPLETED' AND OLD.status IS DISTINCT FROM 'COMPLETED' THEN
    UPDATE "Wallet"
    SET frozen = GREATEST(frozen - NEW.amount - NEW.fee, 0)
    WHERE id = NEW."walletId";

    SELECT "liquidityPoolId"
    INTO liquidity_pool_id
    FROM "BridgeTransfer"
    WHERE "withdrawalId" = NEW.id
    LIMIT 1;

    IF liquidity_pool_id IS NOT NULL THEN
      UPDATE "LiquidityPool"
      SET frozen = GREATEST(frozen - NEW.amount, 0)
      WHERE id = liquidity_pool_id;
    END IF;
  END IF;

  IF NEW.status IN ('FAILED', 'REJECTED') AND OLD.status NOT IN ('FAILED', 'REJECTED') THEN
    UPDATE "Wallet"
    SET balance = balance + NEW.amount + NEW.fee,
        frozen = GREATEST(frozen - NEW.amount, 0)
    WHERE id = NEW."walletId";
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER withdrawal_completed_trigger
AFTER UPDATE OF status ON "Withdrawal"
FOR EACH ROW
EXECUTE FUNCTION update_balances_on_withdrawal();
