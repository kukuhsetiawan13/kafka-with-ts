import { Kafka, logLevel } from "kafkajs";
import { faker } from "@faker-js/faker";
import KAFKA from "./constants/kafka";
import { config } from "./configs/env";

const EXAMPLE_TOPIC = KAFKA.TOPIC;
const EXAMPLE_CONSUMER = KAFKA.CONSUMER;
const KAFKA_BROKER_ADDRESS = config.kafkaBroker;

const kafka = new Kafka({
  //   brokers: [KAFKA_BROKER_ADDRESS],
  brokers: ["localhost:9092"],
  logLevel: logLevel.ERROR,
});
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: EXAMPLE_CONSUMER });

async function main() {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: EXAMPLE_TOPIC });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log({
        offset: message.offset,
        value: message.value?.toString(),
        key: message.key?.toString(),
      });
    },
  });
  process.on("SIGTERM", async () => {
    await consumer.disconnect();
    await producer.disconnect();
    process.exit(0);
  });
  while (true) {
    await new Promise(async (res) => {
      await producer.send({
        topic: EXAMPLE_TOPIC,
        messages: [
          { key: faker.internet.username(), value: faker.internet.emoji() },
        ],
      });
      setTimeout(() => res(null), 3 * Math.random() * 1000);
    }).then((result) => console.log(result, "<<< result"));
  }
}

main();
