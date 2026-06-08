-- AlterTable
ALTER TABLE "products" ADD COLUMN     "blurb" TEXT,
ADD COLUMN     "category" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "details" TEXT,
ADD COLUMN     "eyebrow" TEXT,
ADD COLUMN     "hero" TEXT,
ADD COLUMN     "heroExclude" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "heroPosition" TEXT,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "thumbnail" TEXT;
