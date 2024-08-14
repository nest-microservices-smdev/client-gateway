import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from '../config';
import { CreateUserDto } from './dto';
import { LoginUserDto } from './dto/login-user.dto';

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
  async registerUser(@Body() createUserDto: CreateUserDto) {
    try {
      return firstValueFrom(
        this.authClient.send({ cmd: 'auth.regiter.user' }, createUserDto),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      return firstValueFrom(
        this.authClient.send({ cmd: 'auth.login.user' }, loginUserDto),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('verify')
  async verifyUser() {
    try {
      return firstValueFrom(
        this.authClient.send({ cmd: 'auth.verify.user' }, {}),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
