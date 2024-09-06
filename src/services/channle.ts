import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function getFirstImageByChannelID(channelID: string) {
  return prisma.channels.findFirst({
    where: {
      id: channelID,
    },
    orderBy: {
      lastMessageId: "asc",
    },
  });
}


export function updateChannelLastMessageId(channelID: string, lastMessageId: string) {
  return prisma.channels.update({
    where: {
      id: channelID,
    },
    data: {
      lastMessageId,
    },
  });
}