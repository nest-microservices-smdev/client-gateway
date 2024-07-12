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
  ParseIntPipe,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';

import { Actions } from 'src/common/constants';
import { PaginationDto } from 'src/common/dto';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    try {
      return firstValueFrom(
        this.productsClient.send({ cmd: Actions.Create }, createProductDto),
      );
    } catch (error) {
      throw new RpcException(error);
    }
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return firstValueFrom(
        this.productsClient.send({ cmd: Actions.FindOne }, { id }),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return firstValueFrom(
        this.productsClient.send({ cmd: Actions.Delete }, { id }),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      return firstValueFrom(
        this.productsClient.send(
          { cmd: Actions.Update },
          { id, ...updateProductDto },
        ),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
