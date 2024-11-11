import type { SingleImageData } from "./types";
import storeImage from "./services/bot";
import { updateChannelLastMessageId } from "./services/channle";
import { sendToQueue } from "./services/rabbiteMQ";

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
    const attachmentData = await sendToQueue(
      JSON.stringify({
        prompt,
        url,
        createdAt,
        isSingle,
        messageID,
        channelID,
      })
    );

    if (!attachmentData) continue;

    storedImages++;

    // await updateChannelLastMessageId(channelID, messageID);
  }

  return storedImages;
}
