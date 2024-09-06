import axios from "axios";
import FormData from "form-data";

// Your Discord webhook URL
const webhookUrl =
  "https://discord.com/api/webhooks/1248145076002099220/UTjlZnI5krEY931SILfDEvlavs6IQnfoPjaaGB0FPfVei2muitGz4Ri1B8MEaB6rlmem?wait=true";

export default async function storeAttachment(url: string, prompt: string, build_At: Date) {
  const prevAttachmentData = urlParser(url);
  if (!prevAttachmentData) return null;

  const newFileName = prevAttachmentData.fileName
    .split("_")
    .slice(0, -1)
    .join("_")
    .concat(".png");

  try {
    const imageResponse = await axios.get(url, { responseType: "stream" });

    const formData: FormData = new FormData();
    formData.append("file", imageResponse.data, newFileName);
    formData.append("payload_json", JSON.stringify({ content: prompt }));

    const response = await axios.post(`https://discord.com/api/v10/channels/1247945821408989274/messages`, formData, {
      headers: {
        Authorization: `Bot MTI0Nzg0NTI1NzA4MTY1MTIzMQ.Gl8kgd.WFUlDE9CZ42RaH-aXMiC7vl-UXl5EGN2gHK8rI`,
        ...formData.getHeaders(),
      },
    });
    console.log(new Date, response.headers["x-ratelimit-remaining"]);

    if (Number(response.headers["x-ratelimit-remaining"]) === 0) {
      console.log("headers", response.headers)
      console.log("data",response.data);
      await sleep(Number(response.headers["x-ratelimit-reset-after"]) * 1000);
    }

    const message = response.data;
    const newAttachment = message.attachments[0];
    // console.log(newAttachment);

    if (
      !newAttachment ||
      !newAttachment.height ||
      !newAttachment.width ||
      !newAttachment.size
    )
      return null;

    const newAttachmentData = urlParser(newAttachment.url);

    if (!newAttachmentData) return null;

    return {
      massageID: message.id,
      channelID: message.channel_id,
      height: newAttachment.height,
      width: newAttachment.width,
      size: newAttachment.size,
      ...newAttachmentData,
      fileName: newFileName,
    };
  } catch (error) {
    console.error("Error sending webhook message:", error);
    return null;
  }
}

function urlParser(imageURL: string) {
  const url = new URL(imageURL);
  // Extract the pathname parts
  const pathParts = url.pathname.split("/");

  // Extract the filename
  const fileName = pathParts.pop() || "";

  // Extract the ID
  const id = pathParts.pop() || "";

  // Extract query parameters
  const queryParams = Object.fromEntries(url.searchParams.entries());

  // Create the desired object
  if (
    !queryParams.ex ||
    !queryParams.is ||
    !queryParams.hm ||
    !id ||
    !fileName
  ) {
    return null;
  }
  return {
    attachmentID: id,
    fileName,
    expiresAt: queryParams.ex,
    issuedAt: queryParams.is,
    signature: queryParams.hm,
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
