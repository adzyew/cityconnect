-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "auth0UserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth0UserId_key" ON "users"("auth0UserId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
