import crawler from "./crawler";
import { getAccounts } from "./services/account";
import { spawn } from "child_process";

const db_url = process.env.DATABASE_URL;
if (!db_url) {
  console.error("DATABASE_URL not found");
  process.exit(1);
}

(async () => {
  const accounts = await getAccounts();

  accounts.forEach((account) => {
    account.Channels.forEach(async ({ botToken, id, name, lastMessageId }) => {
      const command = spawn(
        "docker",
        [
          "run",
          "-d",
          `--name`,
          name,
          "-e",
          `DATABASE_URL=${db_url}`,
          "-e",
          `CHANNEL_ID=${id}`,
          "-e",
          `AUTH_TOKEN=${account.authToken}`,
          "-e",
          `LAST_MESSAGE_ID=${lastMessageId}`,
          "-e",
          `CHANNEL_NAME=${name}`,
          "-e",
          `BOT_TOKEN=${botToken}`,
          "ai_image_collector",
        ],
        {
          detached: true,
          stdio: "ignore",
        }
      );
      
      command.unref();
    });
  });
})();
