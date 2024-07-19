import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { envs, ORDER_SERVICE, PRODUCT_SERVICE } from 'src/config';

const natsServices = ClientsModule.register([
  {
    name: PRODUCT_SERVICE,
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers,
    },
  },
  {
    name: ORDER_SERVICE,
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers,
    },
  },
]);

@Module({
  imports: [natsServices],
  exports: [natsServices],
})
export class NatsModule {}
