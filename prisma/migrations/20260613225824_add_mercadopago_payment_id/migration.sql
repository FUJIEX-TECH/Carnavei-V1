-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "mercadoPagoPaymentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_mercadoPagoPaymentId_key" ON "orders"("mercadoPagoPaymentId");
