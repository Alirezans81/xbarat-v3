-- Create Wallets for Each Currency When a User Is Inserted
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
-- 

-- Create Wallets for Each User When a Currency Is Inserted
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
-- 

