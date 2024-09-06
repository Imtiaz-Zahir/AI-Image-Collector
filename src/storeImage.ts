import type { SingleImageData } from "./types";
import storeImage from "./services/bot";
import { updateChannelLastMessageId } from "./services/channle";

export default async function storeImages(
  images: SingleImageData[],
  botToken: string
) {
  let storedImages = 0;

  for (const {
    prompt,
    url,
    createdAt,
    isSingle,
    messageID,
    channelID,
  } of images) {
    const attachmentData = await storeImage({
      url,
      prompt,
      createdAt,
      isSingle,
      botToken,
    });

    if (!attachmentData) continue;

    if (attachmentData.length > 0) storedImages++;
    await updateChannelLastMessageId(channelID, messageID);
  }

  return storedImages;
}
