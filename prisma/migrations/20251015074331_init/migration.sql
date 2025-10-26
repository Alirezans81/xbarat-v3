-- CreateTable
CREATE TABLE "ExchangeMatch" (
    "id" TEXT NOT NULL,
    "fromExchangeId" TEXT NOT NULL,
    "toExchangeId" TEXT NOT NULL,
    "matchedAmount" DECIMAL(20,8) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExchangeMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExchangeMatch_createdAt_idx" ON "ExchangeMatch"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeMatch_fromExchangeId_toExchangeId_key" ON "ExchangeMatch"("fromExchangeId", "toExchangeId");

-- AddForeignKey
ALTER TABLE "ExchangeMatch" ADD CONSTRAINT "ExchangeMatch_fromExchangeId_fkey" FOREIGN KEY ("fromExchangeId") REFERENCES "Exchange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangeMatch" ADD CONSTRAINT "ExchangeMatch_toExchangeId_fkey" FOREIGN KEY ("toExchangeId") REFERENCES "Exchange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
