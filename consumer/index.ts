import amqplib from "amqplib";
import storeImage from "./bot";

let queue = "test";

async function connect() {
  const connection = await amqplib.connect("amqp://localhost");
  const ch1 = await connection.createChannel();
  await ch1.assertQueue(queue, { durable: true });

  ch1.consume(queue, async (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      const attachment = await storeImage(data);
      if (attachment) {
        console.log("Image stored");
      }
    }
  });
}

(async () => {
  await connect();
})();
