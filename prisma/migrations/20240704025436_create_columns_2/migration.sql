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
    "price" DECIMAL NOT NULL DEFAULT 0,
    "payment_method" TEXT NOT NULL DEFAULT 'cash',
    "payment_status" TEXT NOT NULL DEFAULT 'handling',
    CONSTRAINT "schedulings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_schedulings" ("created_at", "date", "email", "id", "name", "observations", "payment_method", "payment_status", "price", "user_id", "user_phone") SELECT "created_at", "date", "email", "id", "name", "observations", "payment_method", "payment_status", "price", "user_id", "user_phone" FROM "schedulings";
DROP TABLE "schedulings";
ALTER TABLE "new_schedulings" RENAME TO "schedulings";
CREATE INDEX "schedulings_user_id_idx" ON "schedulings"("user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
