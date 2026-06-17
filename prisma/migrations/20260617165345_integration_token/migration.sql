-- CreateTable
CREATE TABLE "integration_tokens" (
    "provider" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "integration_tokens_pkey" PRIMARY KEY ("provider")
);
