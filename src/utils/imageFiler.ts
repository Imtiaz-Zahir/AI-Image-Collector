import type { RowImageData, SingleImageData } from "../types";

export function filterGeneratedImages(imageData: RowImageData[]) {
  return imageData.filter(
    (image) =>
      image?.author?.username === "Midjourney Bot" &&
      image?.attachments?.length > 0
  );
}

export function separateImages(imageData: RowImageData[]) {
  return imageData.reduce((acc: SingleImageData[], image) => {
    acc.push({
      createdAt: image.timestamp,
      prompt: image.content,
      url: image.attachments[0].url,
      isSingle: isSingleImage(image),
      messageID: image.id,
      channelID: image.channel_id,
    });

    return acc;
  }, []);
}

export function isSingleImage(image: RowImageData) {
  if (
    image?.components[0]?.components[0]?.label === "Vary (Strong)" ||
    image?.components[0]?.components[0]?.label === "Make Variations" ||
    image?.components[0]?.components[0]?.label === "Upscale (2x)" ||
    image?.components[0]?.components[0]?.label === "Upscale (Subtle)" ||
    image?.components[0]?.components[0]?.label === "Redo Upscale (Subtle)"
  )
    return true;

  return false;
}
