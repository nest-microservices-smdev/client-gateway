import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  ORDERS_MICROSERVICE_URL: string;
  ORDERS_MICROSERVICE_PORT: number;
}

const envVarsSchema = joi
  .object({
    PORT: joi.number().required().default(3000),
    ORDERS_MICROSERVICE_URL: joi.string().required(),
    ORDERS_MICROSERVICE_PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  orderMicroserviceUrl: envVars.ORDERS_MICROSERVICE_URL,
  orderMicroservicePort: envVars.ORDERS_MICROSERVICE_PORT,
  natsServers: process.env.NATS_SERVER,
};
