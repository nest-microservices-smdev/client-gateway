import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  PRODUCTS_MICROSERVICE_URL: string;
  PRODUCTS_MICROSERVICE_PORT: number;
  ORDERS_MICROSERVICE_URL: string;
  ORDERS_MICROSERVICE_PORT: number;
}

const envVarsSchema = joi
  .object({
    PORT: joi.number().required().default(3000),
    PRODUCTS_MICROSERVICE_URL: joi.string().required(),
    PRODUCTS_MICROSERVICE_PORT: joi.number().required(),
    ORDERS_MICROSERVICE_URL: joi.string().required(),
    ORDERS_MICROSERVICE_PORT: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  productsMicroserviceUrl: envVars.PRODUCTS_MICROSERVICE_URL,
  productsMicroservicePort: envVars.PRODUCTS_MICROSERVICE_PORT,
  orderMicroserviceUrl: envVars.ORDERS_MICROSERVICE_URL,
  orderMicroservicePort: envVars.ORDERS_MICROSERVICE_PORT,
};
