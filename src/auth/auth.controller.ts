import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from '../config';
import { CreateUserDto } from './dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { Token, User } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';

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
      console.log('SALIMOS POR ESTE CATCH');
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

  @UseGuards(AuthGuard)
  @Get('verify')
  async verifyUser(@User() user: CurrentUser, @Token() token: string) {
    try {
      /*
      return firstValueFrom(
        this.authClient.send({ cmd: 'auth.verify.user' }, req),
      );
      */
      return { user, token };
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
