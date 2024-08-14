import { Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { NATS_SERVICE } from '../config';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly authClient: ClientProxy) {}

  async onModuleInit() {
    try {
      await this.authClient.connect();
      Logger.log('Successfully connected to the Auth microservice');
    } catch (error) {
      Logger.error(`Failed to connect to the Auth microservice: ${error}`);
    }
  }

  @Post('register')
  async registerUser() {
    try {
      return firstValueFrom(
        this.authClient.send({ cmd: 'auth.regiter.user' }, {}),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('login')
  loginUser() {
    try {
      return firstValueFrom(
        this.authClient.send({ cmd: 'auth.login.user' }, {}),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('verify')
  verifyUser() {
    try {
      return firstValueFrom(
        this.authClient.send({ cmd: 'auth.verify.user' }, {}),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
