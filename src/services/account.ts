import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function getAccounts() {
  return prisma.accounts.findMany({ include: { Channels: true } });
}