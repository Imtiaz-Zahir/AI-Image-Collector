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
          `CHANNEL_ID=${id}`,
          `AUTH_TOKEN=${account.authToken}`,
          `LAST_MESSAGE_ID=${lastMessageId}`,
          `CHANNEL_NAME=${name}`,
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
