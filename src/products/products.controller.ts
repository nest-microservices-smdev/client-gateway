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
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';

import { Actions } from 'src/common/constants';
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
    return this.productsClient
      .send({ cmd: Actions.FindAll }, paginationDto)
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return firstValueFrom(
        this.productsClient.send({ cmd: Actions.FindOne }, { id }),
      );
    } catch (error) {
      throw new RpcException(error);
    }
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
