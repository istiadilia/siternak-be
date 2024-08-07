/*
  Warnings:

  - You are about to drop the column `keterangan` on the `Post` table. All the data in the column will be lost.
  - Added the required column `alamatAksi` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jumlahTernak` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keteranganAksi` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "keterangan",
ADD COLUMN     "alamatAksi" TEXT NOT NULL,
ADD COLUMN     "jumlahTernak" INTEGER NOT NULL,
ADD COLUMN     "keteranganAksi" TEXT NOT NULL;
