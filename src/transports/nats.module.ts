import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { envs, NATS_SERVICE } from 'src/config';

const natsServices = ClientsModule.register([
  {
    name: NATS_SERVICE,
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
