-- 관리자 기능(6ca1a81)에서 schema.prisma에 추가됐지만 마이그레이션이 누락되었던 User.role.
-- 이미 role이 반영된 DB(배포 DB 등)에서도 에러 없이 통과하도록 멱등(idempotent)하게 작성했습니다.

-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
    CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
  END IF;
END
$$;

-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" "Role" NOT NULL DEFAULT 'USER';
