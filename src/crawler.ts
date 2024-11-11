import storeImages from "./storeImage";
import getNewImages from "./utils/getNewImages";
import { filterGeneratedImages, separateImages } from "./utils/imageFiler";

export default async function crawler(
  channelId: string,
  token: string,
  lastImageId: string,
  channelName: string,
  botToken: string
) {
  const startTime = performance.now();
  let totalNewImage = 0;
  let imageStored = 0;
  let selectedImage = 0;

  try {
    const newImages = await getNewImages(channelId, lastImageId, token);

    totalNewImage = newImages.length;

    console.log(`get ${totalNewImage} images from ${channelName} -> ${channelId}`);

    if (totalNewImage > 0) lastImageId = newImages[0].id;

    const generatedImages = filterGeneratedImages(newImages);

    selectedImage = generatedImages.length;

    const images = separateImages(generatedImages);

    imageStored = await storeImages(images, botToken);

  } catch (error) {
    console.error(error);
  }

  const totalTime = ((performance.now() - startTime) / 1000).toFixed(3);
  console.log(
    `get ${totalNewImage} -> select ${selectedImage} -> store ${imageStored} in ${totalTime} second - [${channelName} -> ${channelId}]`
  );

  if (totalNewImage < 100) {
    console.log(`Wait 10 minutes for ${channelName} -> ${channelId}`);
    await delay(1000 * 60 * 10); // 10 minutes
  }

  crawler(channelId, token, lastImageId, channelName, botToken);
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
