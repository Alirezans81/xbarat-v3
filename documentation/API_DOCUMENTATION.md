# API Documentation - Xbarat v3

## 📖 معرفی

این سند شامل تمام endpoints API در Xbarat v3 است.

**Base URL:** `http://localhost:3000/api`  
**Protocol:** REST + JSON  
**Authentication:** JWT Bearer Token

---

## 🔐 Authentication

### تمام API endpoints (غیر public) نیاز به Authorization دارند

```bash
Authorization: Bearer <JWT_TOKEN>
```

### دریافت Token

```http
POST /api/user/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 👤 User Management

### 1. Register (ثبت‌نام)

```http
POST /api/user/register
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "phoneNumber": "+989123456789",
  "fullName": "Ali Reza",
  "password": "SecurePassword123!",
  "countryCode": "IR"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "newuser@example.com",
      "phoneNumber": "+989123456789",
      "fullName": "Ali Reza",
      "kycStatus": "PENDING",
      "role": "CUSTOMER"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error (400):**

```json
{
  "success": false,
  "error": "Email already exists",
  "code": "EMAIL_DUPLICATE"
}
```

---

### 2. Login (ورود)

```http
POST /api/user/login
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "CUSTOMER"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 3. دریافت Profile (احتیاج Authorization)

```http
GET /api/user/profile
Authorization: Bearer <TOKEN>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "phoneNumber": "+989123456789",
    "fullName": "John Doe",
    "avatarUrl": "https://...",
    "countryCode": "IR",
    "nationality": "IR",
    "language": "fa",
    "kycStatus": "APPROVED",
    "isPhoneVerified": true,
    "isEmailVerified": true,
    "role": "CUSTOMER",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 4. بروزرسانی Profile

```http
PUT /api/user/profile
Content-Type: application/json
Authorization: Bearer <TOKEN>
```

**Request Body:**

```json
{
  "fullName": "Ali Reza Updated",
  "avatarUrl": "https://...",
  "nationality": "IR",
  "language": "fa"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fullName": "Ali Reza Updated",
    "updatedAt": "2024-01-20T15:45:00Z"
  }
}
```

---

### 5. تایید ایمیل

```http
POST /api/user/verify-email
Content-Type: application/json
Authorization: Bearer <TOKEN>
```

**Request Body:**

```json
{
  "code": "123456"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully",
    "isEmailVerified": true
  }
}
```

---

### 6. تایید شماره تلفن

```http
POST /api/user/verify-phone
Content-Type: application/json
Authorization: Bearer <TOKEN>
```

**Request Body:**

```json
{
  "code": "123456"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "message": "Phone verified successfully",
    "isPhoneVerified": true
  }
}
```

---

### 7. ارسال درخواست KYC

```http
POST /api/user/kyc
Content-Type: multipart/form-data
Authorization: Bearer <TOKEN>
```

**Request Data:**

```
documentType: NATIONAL_ID
documentNumber: 1234567890
documentPhotoUrl: <file>
dateOfBirth: 1990-01-15
address: 123 Main St
city: Tehran
state: Tehran Province
postalCode: 11111
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "kycStatus": "PENDING",
    "documentType": "NATIONAL_ID",
    "documentNumber": "1234567890",
    "documentPhotoUrl": "https://s3.../document.jpg"
  }
}
```

---

## 💵 Currency Management

### 1. دریافت لیست تمام ارزها

```http
GET /api/currency
```

**Query Parameters:**

```
?skip=0&limit=20&isActive=true
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "code": "USD",
      "name": "US Dollar",
      "symbol": "$",
      "decimals": 2,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid-2",
      "code": "EUR",
      "name": "Euro",
      "symbol": "€",
      "decimals": 2,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid-3",
      "code": "IRR",
      "name": "Iranian Rial",
      "symbol": "﷼",
      "decimals": 0,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 3
}
```

---

### 2. دریافت جزئیات ارز

```http
GET /api/currency/:id
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-1",
    "code": "USD",
    "name": "US Dollar",
    "symbol": "$",
    "decimals": 2,
    "paymentChannels": [
      {
        "id": "uuid",
        "name": "Stripe"
      }
    ]
  }
}
```

---

### 3. ایجاد ارز جدید (Admin Only)

```http
POST /api/currency
Content-Type: application/json
Authorization: Bearer <ADMIN_TOKEN>
```

**Request Body:**

```json
{
  "code": "GBP",
  "name": "British Pound",
  "symbol": "£",
  "decimals": 2
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-4",
    "code": "GBP",
    "name": "British Pound",
    "symbol": "£",
    "decimals": 2,
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

---

## 📊 Currency Pair (نرخ‌های تبادل)

### 1. دریافت لیست نرخ‌ها

```http
GET /api/currency-pair
```

**Query Parameters:**

```
?skip=0&limit=20&isActive=true
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "fromCurrency": {
        "id": "uuid",
        "code": "USD",
        "name": "US Dollar"
      },
      "toCurrency": {
        "id": "uuid",
        "code": "EUR",
        "name": "Euro"
      },
      "rate": "0.92",
      "feePercentage": "0.02",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1
}
```

---

### 2. دریافت نرخ خاص

```http
GET /api/currency-pair/:id
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fromCurrencyId": "uuid-1",
    "toCurrencyId": "uuid-2",
    "rate": "0.92",
    "isInverseRate": false,
    "feePercentage": "0.02",
    "isActive": true
  }
}
```

---

### 3. ایجاد نرخ جدید (Admin)

```http
POST /api/currency-pair
Content-Type: application/json
Authorization: Bearer <ADMIN_TOKEN>
```

**Request Body:**

```json
{
  "fromCurrencyId": "uuid-1",
  "toCurrencyId": "uuid-2",
  "rate": "0.92",
  "isInverseRate": false,
  "feePercentage": "0.02",
  "isActive": true
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fromCurrencyId": "uuid-1",
    "toCurrencyId": "uuid-2",
    "rate": "0.92",
    "feePercentage": "0.02",
    "isActive": true,
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

---

## 💼 Wallet Management

### 1. دریافت کیف‌پول‌های کاربر

```http
GET /api/wallet
Authorization: Bearer <TOKEN>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "userId": "user-uuid",
      "currency": {
        "id": "uuid",
        "code": "USD",
        "name": "US Dollar",
        "symbol": "$"
      },
      "balance": "1000.50",
      "frozen": "100.00",
      "createdAt": "2024-01-10T00:00:00Z",
      "updatedAt": "2024-01-20T15:30:00Z"
    },
    {
      "id": "uuid-2",
      "userId": "user-uuid",
      "currency": {
        "id": "uuid",
        "code": "EUR",
        "name": "Euro",
        "symbol": "€"
      },
      "balance": "500.00",
      "frozen": "0.00",
      "createdAt": "2024-01-11T00:00:00Z",
      "updatedAt": "2024-01-21T10:00:00Z"
    }
  ]
}
```

---

### 2. دریافت جزئیات کیف‌پول

```http
GET /api/wallet/:id
Authorization: Bearer <TOKEN>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-1",
    "userId": "user-uuid",
    "currencyId": "currency-uuid",
    "balance": "1000.50",
    "frozen": "100.00",
    "createdAt": "2024-01-10T00:00:00Z",
    "updatedAt": "2024-01-20T15:30:00Z"
  }
}
```

---

### 3. انتقال میان کیف‌پول‌ها

```http
POST /api/wallet/transfer
Content-Type: application/json
Authorization: Bearer <TOKEN>
```

**Request Body:**

```json
{
  "fromWalletId": "uuid-1",
  "toWalletId": "uuid-2",
  "amount": "100.00",
  "note": "Transfer to savings"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "transfer-uuid",
    "fromWalletId": "uuid-1",
    "toWalletId": "uuid-2",
    "amount": "100.00",
    "status": "COMPLETED",
    "note": "Transfer to savings",
    "createdAt": "2024-01-20T15:45:00Z",
    "completedAt": "2024-01-20T15:45:30Z"
  }
}
```

---

## 📥 Deposit (واریزی)

### 1. ایجاد درخواست واریزی

```http
POST /api/deposit
Content-Type: application/json
Authorization: Bearer <TOKEN>
```

**Request Body:**

```json
{
  "walletId": "wallet-uuid",
  "amount": "500.00",
  "paymentChannelId": "channel-uuid"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "deposit-uuid",
    "userId": "user-uuid",
    "walletId": "wallet-uuid",
    "amount": "500.00",
    "fee": "0.00",
    "status": "PENDING",
    "reference": "DEP-2024-0001",
    "paymentChannelId": "channel-uuid",
    "createdAt": "2024-01-20T16:00:00Z"
  }
}
```

---

### 2. دریافت لیست واریزی‌ها

```http
GET /api/deposit
Authorization: Bearer <TOKEN>
```

**Query Parameters:**

```
?skip=0&limit=20&status=COMPLETED
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "deposit-uuid",
      "amount": "500.00",
      "status": "COMPLETED",
      "reference": "DEP-2024-0001",
      "currency": "USD",
      "paymentChannel": "Stripe",
      "createdAt": "2024-01-15T10:00:00Z",
      "completedAt": "2024-01-15T10:05:00Z"
    }
  ],
  "total": 5
}
```

---

### 3. دریافت جزئیات واریزی

```http
GET /api/deposit/:id
Authorization: Bearer <TOKEN>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "deposit-uuid",
    "userId": "user-uuid",
    "walletId": "wallet-uuid",
    "amount": "500.00",
    "fee": "0.00",
    "status": "COMPLETED",
    "reference": "DEP-2024-0001",
    "paymentChannel": {
      "id": "channel-uuid",
      "name": "Stripe"
    },
    "createdAt": "2024-01-15T10:00:00Z",
    "completedAt": "2024-01-15T10:05:00Z"
  }
}
```

---

## 📤 Withdrawal (برداشتی)

### 1. ایجاد درخواست برداشتی

```http
POST /api/withdrawal
Content-Type: application/json
Authorization: Bearer <TOKEN>
```

**Request Body:**

```json
{
  "walletId": "wallet-uuid",
  "amount": "200.00",
  "paymentChannelId": "channel-uuid",
  "receiverAddress": "user@bank.example.com",
  "addressOwnerName": "John Doe"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "withdrawal-uuid",
    "userId": "user-uuid",
    "walletId": "wallet-uuid",
    "amount": "200.00",
    "fee": "1.00",
    "status": "PENDING",
    "reference": "WTH-2024-0001",
    "receiverAddress": "user@bank.example.com",
    "addressOwnerName": "John Doe",
    "createdAt": "2024-01-20T16:30:00Z"
  }
}
```

---

### 2. دریافت لیست برداشتی‌ها

```http
GET /api/withdrawal
Authorization: Bearer <TOKEN>
```

**Query Parameters:**

```
?skip=0&limit=20&status=COMPLETED
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "withdrawal-uuid",
      "amount": "200.00",
      "status": "COMPLETED",
      "reference": "WTH-2024-0001",
      "receiverAddress": "user@bank.example.com",
      "currency": "USD",
      "createdAt": "2024-01-15T14:00:00Z",
      "completedAt": "2024-01-15T14:30:00Z"
    }
  ],
  "total": 3
}
```

---

## 🌉 Bridge Transfer

### 1. دریافت لیست انتقال‌های پل

```http
GET /api/bridge-transfer
Authorization: Bearer <TOKEN>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "bridge-uuid",
      "status": "COMPLETED",
      "amount": "500.00",
      "deposit": {
        "id": "deposit-uuid",
        "reference": "DEP-2024-0001"
      },
      "withdrawal": {
        "id": "withdrawal-uuid",
        "reference": "WTH-2024-0001"
      },
      "createdAt": "2024-01-15T10:00:00Z",
      "completedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## 🏦 Payment Channel

### 1. دریافت کانال‌های پرداخت

```http
GET /api/payment-channel
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "channel-uuid-1",
      "name": "Stripe",
      "description": "Credit card payments",
      "currencies": ["USD", "EUR", "GBP"],
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "channel-uuid-2",
      "name": "Bank Transfer",
      "description": "Direct bank transfer",
      "currencies": ["USD", "EUR", "IRR"],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## 🏊 Liquidity Pool

### 1. دریافت استخرهای نقدینگی

```http
GET /api/liquidity-pool
Authorization: Bearer <TOKEN>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "pool-uuid",
      "currency": {
        "code": "USD",
        "name": "US Dollar"
      },
      "paymentChannel": {
        "name": "Stripe"
      },
      "balance": "50000.00",
      "frozen": "5000.00",
      "address": "stripe_account_id",
      "updatedAt": "2024-01-20T20:00:00Z"
    }
  ]
}
```

---

## ❌ Error Handling

### Common Error Codes

| Code                   | Description              | HTTP Status |
| ---------------------- | ------------------------ | ----------- |
| `UNAUTHORIZED`         | Invalid or missing token | 401         |
| `FORBIDDEN`            | Insufficient permissions | 403         |
| `NOT_FOUND`            | Resource not found       | 404         |
| `VALIDATION_ERROR`     | Invalid request data     | 400         |
| `DUPLICATE_EMAIL`      | Email already exists     | 400         |
| `INSUFFICIENT_BALANCE` | Not enough balance       | 400         |
| `INVALID_CURRENCY`     | Currency not supported   | 400         |
| `SERVER_ERROR`         | Internal server error    | 500         |

### Error Response Example

```json
{
  "success": false,
  "error": "Invalid email format",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "email",
    "message": "Must be a valid email"
  }
}
```

---

## 📊 Rate Limiting

تمام API endpoints محدود شده با:

- **100 requests per minute** برای کاربران عادی
- **1000 requests per minute** برای Admin

**Response Header:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642699200
```

---

## 📝 Pagination

برای endpoints که لیست برمی‌گردند:

```http
GET /api/resource?skip=0&limit=20
```

**Response:**

```json
{
  "success": true,
  "data": [...],
  "total": 150,
  "skip": 0,
  "limit": 20
}
```

---

## 🔗 Related Resources

- [User Documentation](README.md)
- [Architecture Guide](ARCHITECTURE.md)
- [Development Guide](DEVELOPMENT.md)

---

**آخرین به‌روزرسانی:** December 2024
