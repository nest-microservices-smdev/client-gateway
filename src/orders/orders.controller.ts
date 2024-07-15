import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ORDER_SERVICE } from 'src/config';
import { getActionName } from 'src/common/constants';
import { firstValueFrom } from 'rxjs';
import { ENTITY_NAME } from 'src/common/constants';

const { ORDER, ORDERS } = ENTITY_NAME;
const ACTIONS = getActionName(ORDER);

@Controller(ORDERS)
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

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
  findAll() {
    return this.ordersClient.send({ cmd: ACTIONS.findAll }, {});
  }

  @Get(':id')
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersClient.send(
      { cmd: ACTIONS.update },
      { id, ...updateOrderDto },
    );
  }
}
