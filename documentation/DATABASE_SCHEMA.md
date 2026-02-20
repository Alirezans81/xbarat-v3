# Database Schema Notes

مرجع رسمی ساختار دیتابیس: `prisma/schema.prisma`

این فایل خلاصه‌ی مدل‌های کلیدی و قوانین اجرایی فعلی است.

## مدل‌های هسته
- `User`
- `Wallet` (کلید یکتا: `@@unique([userId, currencyId])`)
- `Currency`
- `CurrencyPair`
- `Deposit`
- `Withdrawal`
- `Exchange`
- `BridgeTransfer`
- `LiquidityPool`
- `FeeUser`

## Enums مهم
- `DepositStatus`
- `WithdrawalStatus`
- `ExchangeStatus`
- `BridgeStatus`

## قواعد مهم پیاده‌سازی فعلی
1. ایجاد user جدید:
- برای تمام currencyهای موجود، wallet ساخته می‌شود (بک‌اند).

2. ایجاد currency جدید:
- برای تمام userهای موجود، wallet ساخته می‌شود (بک‌اند).

3. Deposit:
- وقتی `status -> COMPLETED` شود، موجودی wallet افزایش می‌یابد.
- اگر bridge transfer مرتبط داشته باشد، `LiquidityPool.balance` هم افزایش می‌یابد.

4. Withdrawal:
- در create، مبلغ از `Wallet.balance` کم و به `Wallet.frozen` منتقل می‌شود.
- در `COMPLETED`، frozen آزاد می‌شود.
- در `FAILED/REJECTED` یا delete قبل completion، مبلغ برمی‌گردد.

5. Exchange:
- در create، `fromAmount + fee` از balance کم می‌شود و `fromAmount` وارد frozen می‌شود.
- با کاهش `remainingAmount`، از frozen کم و معادل آن به wallet مقصد اضافه می‌شود.
- در `COMPLETED`، باقی frozen آزاد و fee به fee-user فعال منتقل می‌شود (اگر وجود داشته باشد).
- در `FAILED/CANCELED`، `remainingAmount + fee` برگشت می‌خورد.
