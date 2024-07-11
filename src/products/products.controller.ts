import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
  Body,
  Inject,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { PaginationDto } from 'src/common/dto';
import { PRODUCT_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  create() {
    return 'This action adds a new product';
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({ cmd: 'findAll' }, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} product`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} product`;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: any) {
    return `This action updates a #${id} product, with the following data: ${updateProductDto}`;
  }
}
