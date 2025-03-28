import { Kafka, logLevel } from "kafkajs";
import { faker } from "@faker-js/faker";
import KAFKA from "./constants/kafka";
import { config } from "./configs/env";

const EXAMPLE_TOPIC = KAFKA.TOPIC;
const EXAMPLE_CONSUMER = KAFKA.CONSUMER;
const KAFKA_BROKER_ADDRESS = config.kafkaBroker;

const kafka = new Kafka({
  brokers: [KAFKA_BROKER_ADDRESS],
  logLevel: logLevel.ERROR,
});

const consumer = kafka.consumer({ groupId: EXAMPLE_CONSUMER });

async function main() {
  await consumer.connect();
  await consumer.subscribe({ topic: EXAMPLE_TOPIC });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log(message, "<<< message");

      console.log({
        offset: message.offset,
        value: message.value?.toString(),
        key: message.key?.toString(),
      });
    },
  });
  process.on("SIGTERM", async () => {
    await consumer.disconnect();

    process.exit(0);
  });
}

main();
