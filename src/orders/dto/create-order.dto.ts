import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

import { OrderStatus, OrderStatusList } from '../enum/order.enum';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @IsNumber()
  @IsPositive()
  totalItems: number;

  @IsEnum(OrderStatusList, {
    message: `Status must be one of the following values: ${OrderStatusList}`,
  })
  @IsOptional()
  status = OrderStatus.PENDING;

  @IsBoolean()
  @IsOptional()
  paid = false;
}
