import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto';
import { OrderStatusList, OrderStatus } from '../enum/order.enum';

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: `Valid status are ${OrderStatusList}`,
  })
  status: OrderStatus;
}
