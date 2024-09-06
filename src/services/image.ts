import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ImageInput = {
  massageID: string;
  prompt: string;
  channelID: string;
  height: number;
  width: number;
  size: number;
  attachmentID: string;
  fileName: string;
  expiresAt: string;
  issuedAt: string;
  signature: string;
  build_At: Date;
};

type ImageOutput = ImageInput & {
  _id: string;
  download: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function createImage({
  id,
  prompt,
}: {
  id: string;
  prompt: string;
}) {
  // await connectToDB();
  // return (await ImageModel.create(images)) as ImageOutput;
  return prisma.images.create({
    data: {
      id,
      prompt,
    },
  });
}

export async function getLastImageByChannelID(channelID: string) {
  // await connectToDB();
  // return (await ImageModel.findOne({ channelID }).sort({
  //   massageID: -1,
  // })) as ImageOutput | null;
  
}

// export async function getFirstImageByChannelID(channelID: string) {
//   await connectToDB();
//   return (await ImageModel.findOne({ channelID }).sort({
//     massageID: 1,
//   })) as ImageOutput | null;
// }
