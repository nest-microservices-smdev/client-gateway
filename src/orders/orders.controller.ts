import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Logger,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { CreateOrderDto } from './dto/create-order.dto';
import { NATS_SERVICE } from 'src/config';
import { getActionName } from 'src/common/constants';
import { firstValueFrom } from 'rxjs';
import { ENTITY_NAME } from 'src/common/constants';
import { PaginationDto } from 'src/common/dto';
import { StatusDto } from './dto/status.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';

const { ORDER, ORDERS } = ENTITY_NAME;
const ACTIONS = getActionName(ORDER);

@Controller(ORDERS)
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  async onModuleInit() {
    try {
      await this.ordersClient.connect();
      Logger.log('Successfully connected to the microservice');
    } catch (error) {
      Logger.error(`Failed to connect to the Orders microservice: ${error}`);
    }
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    try {
      return firstValueFrom(
        this.ordersClient.send({ cmd: ACTIONS.create }, createOrderDto),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    try {
      return firstValueFrom(
        this.ordersClient.send({ cmd: ACTIONS.findAll }, orderPaginationDto),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  findByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      return firstValueFrom(
        this.ordersClient.send(
          { cmd: ACTIONS.findAll },
          {
            status: statusDto.status,
            ...paginationDto,
          },
        ),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('/id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return firstValueFrom(
        this.ordersClient.send({ cmd: ACTIONS.findOne }, { id }),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() statusDto: StatusDto) {
    try {
      console.log({ cmd: ACTIONS.changeOrderStatus });
      return firstValueFrom(
        this.ordersClient.send(
          { cmd: ACTIONS.changeOrderStatus },
          { id, status: statusDto.status },
        ),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
