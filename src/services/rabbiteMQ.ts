import amqplib from "amqplib";

let ch1: amqplib.Channel;
let queue = "test";

async function connect() {
  const connection = await amqplib.connect("amqp://localhost");
  ch1 = await connection.createChannel();
  await ch1.assertQueue(queue, { durable: true });
}

export async function sendToQueue(data: string) {
  return ch1.sendToQueue(queue, Buffer.from(data));
}

(async () => {
  await connect();
})();