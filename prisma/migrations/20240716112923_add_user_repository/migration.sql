/*
  Warnings:

  - Added the required column `user_id` to the `UserRepository` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "UserRepository_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserRepository" ("description", "id", "image_url", "name") SELECT "description", "id", "image_url", "name" FROM "UserRepository";
DROP TABLE "UserRepository";
ALTER TABLE "new_UserRepository" RENAME TO "UserRepository";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
