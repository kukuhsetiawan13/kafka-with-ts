import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  KAFKA_BROKER: z.string().min(1, "KAFKA_BROKER is required"),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("Invalid environment variables:", env.error.format());
  process.exit(1);
}

export const config = {
  kafkaBroker: env.data.KAFKA_BROKER,
};
