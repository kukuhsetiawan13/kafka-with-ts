import { Kafka, logLevel } from "kafkajs";
import { faker } from "@faker-js/faker";
import KAFKA from "./constants/kafka";
import { config } from "./configs/env";

const EXAMPLE_TOPIC = KAFKA.TOPIC;
const KAFKA_BROKER_ADDRESS = config.kafkaBroker;

const kafka = new Kafka({
  brokers: [KAFKA_BROKER_ADDRESS],
  logLevel: logLevel.ERROR,
});
const producer = kafka.producer();

async function main() {
  await producer.connect();

  process.on("SIGTERM", async () => {
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
    });
  }
}

main();
