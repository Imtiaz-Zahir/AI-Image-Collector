import crawler from "./crawler";
import { getAccounts } from "./services/account";

(async () => {
  const accounts = await getAccounts();

  accounts.forEach((account) => {
    account.Channels.forEach(async ({ botToken, id, name, lastMessageId }) => {
      crawler(id, account.authToken, lastMessageId, name, botToken);
    });
  });
})();