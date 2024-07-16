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
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { CreateOrderDto } from './dto/create-order.dto';
import { ORDER_SERVICE } from 'src/config';
import { getActionName } from 'src/common/constants';
import { firstValueFrom } from 'rxjs';
import { ENTITY_NAME } from 'src/common/constants';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { PaginationDto } from 'src/common/dto';
import { StatusDto } from './dto/status.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';

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
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    return this.ordersClient.send(
      { cmd: ACTIONS.update },
      { id, ...changeOrderStatusDto },
    );
  }
}
