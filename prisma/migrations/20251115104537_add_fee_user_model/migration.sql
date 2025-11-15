-- CreateTable
CREATE TABLE "FeeUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FeeUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FeeUser" ADD CONSTRAINT "FeeUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
