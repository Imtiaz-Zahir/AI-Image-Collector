import type { RowImageData } from "../types";

export default async function getNewImages(
    channelId: string,
    lastImgId: string,
    token: string,
  ) {
    const res = await fetch(
      `https://discord.com/api/v9/channels/${channelId}/messages?after=${lastImgId}&limit=100`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  
    const data: RowImageData[] = await res.json();
    return data;
  }