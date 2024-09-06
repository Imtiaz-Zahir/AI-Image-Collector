import axios from "axios";
import {
  Client,
  GatewayIntentBits,
  AttachmentBuilder,
  TextChannel,
} from "discord.js";
import sharp from "sharp";

const bots: { [key: string]: TextChannel } = {};

async function getChannel(botToken: string) {
  try {
    if (bots[botToken])
      return bots[botToken]

    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        // GatewayIntentBits.MessageContent,
      ],
      // partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });

    client.on("ready", () => {
      console.info(`Bot ${client.user?.tag} is ready.`);
    });

    await client.login(botToken);

    const channel = await client.channels.fetch("1276611343662710937");

    if (!channel) throw new Error("Channel not found.");

    if (channel.isTextBased().valueOf() === false)
      throw new Error("Channel is not text channel.");

    bots[botToken] = channel as TextChannel;

    return channel as TextChannel;

  } catch (error) {
    console.error("Failed to login:", error);
    throw error;
  }
}

export default async function storeImage({
  botToken,
  createdAt,
  isSingle,
  prompt,
  url,
}: {
  url: string;
  prompt: string;
  botToken: string;
  createdAt: Date;
  isSingle: boolean;
}) {
  const startTime = performance.now();

  const prevAttachmentData = urlParser(url);
  if (!prevAttachmentData) return null;

  const newFileName = prevAttachmentData.fileName
    .split("_")
    .slice(0, -1)
    .join("_")
    .concat(".png");

  const channel = await getChannel(botToken);

  const image = await axios.get(url, { responseType: "arraybuffer" });

  if (image.status !== 200) return null;

  if (!isSingle) {
    const metadata = await sharp(image.data).metadata();
    const width = metadata.width;
    const height = metadata.height;

    if (!width || !height) return null;

    const messages = [];

    // Define the regions to slice
    const regions = [
      { left: 0, top: 0, width: width / 2, height: height / 2 }, // Top-left
      { left: width / 2, top: 0, width: width / 2, height: height / 2 }, // Top-right
      { left: 0, top: height / 2, width: width / 2, height: height / 2 }, // Bottom-left
      {
        left: width / 2,
        top: height / 2,
        width: width / 2,
        height: height / 2,
      }, // Bottom-right
    ];

    for (let i = 0; i < regions.length; i++) {
      const slicedBuffer = await sharp(image.data)
        .extract(regions[i])
        .toBuffer();

      const attachment = new AttachmentBuilder(slicedBuffer, {
        name: `${newFileName.split(".")[0]}_part${i + 1}.png`,
      });

      const massage = await channel.send({
        content: new Date(createdAt).getTime() + " - " + makePrompt(prompt),
        files: [attachment],
      });

      messages.push({
        massageID: massage.id,
        prompt: removeUrl(massage.content),
      });
    }

    const totalTime = ((performance.now() - startTime) / 1000).toFixed(3);
    console.info(
      `Stored attachment -> ${messages.map(({massageID})=>massageID).join(", ")} in ${totalTime} seconds.`
    );

    return messages;
  } else {
    const attachment = new AttachmentBuilder(image.data, { name: newFileName });

    const massage = await channel.send({
      content: new Date(createdAt).getTime() + " - " + makePrompt(prompt),
      files: [attachment],
    });

    const totalTime = ((performance.now() - startTime) / 1000).toFixed(3);
    console.info(`Stored attachment -> ${massage.id} in ${totalTime} seconds.`);

    return [
      {
        massageID: massage.id,
        prompt: removeUrl(massage.content),
      },
    ];
  }
}

function urlParser(imageURL: string) {
  const url = new URL(imageURL);
  const pathParts = url.pathname.split("/");
  const fileName = pathParts.pop() || "";
  const id = pathParts.pop() || "";
  const queryParams = Object.fromEntries(url.searchParams.entries());
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

function makePrompt(inputString: string) {
  const matches = inputString.match(/\*\*(.*?)\*\*/g);

  if (matches && matches.length > 0) inputString = matches[0].slice(2, -2);

  return inputString;
}

function removeUrl(inputString: string): string {
  return inputString.replace(/<[^<>]+>/g, "<your image>");
}
