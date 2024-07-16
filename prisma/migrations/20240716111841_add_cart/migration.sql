/*
  Warnings:

  - You are about to drop the `Haircut` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `price` on the `schedulings` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Haircut_userId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Haircut";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "total_price" DECIMAL NOT NULL,
    CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cart_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_schedulings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "observations" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "user_phone" TEXT,
    "payment_method" TEXT NOT NULL DEFAULT 'cash',
    "payment_status" TEXT NOT NULL DEFAULT 'pending',
    "cartId" TEXT,
    CONSTRAINT "schedulings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "schedulings_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_schedulings" ("created_at", "date", "email", "id", "name", "observations", "payment_method", "payment_status", "user_id", "user_phone") SELECT "created_at", "date", "email", "id", "name", "observations", "payment_method", "payment_status", "user_id", "user_phone" FROM "schedulings";
DROP TABLE "schedulings";
ALTER TABLE "new_schedulings" RENAME TO "schedulings";
CREATE INDEX "schedulings_user_id_idx" ON "schedulings"("user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "carts_user_id_idx" ON "carts"("user_id");

-- CreateIndex
CREATE INDEX "cart_items_cart_id_idx" ON "cart_items"("cart_id");

-- CreateIndex
CREATE INDEX "cart_items_product_id_idx" ON "cart_items"("product_id");
