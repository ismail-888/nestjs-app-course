import { ProductsService } from './products.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  // NotFoundException,
  Put,
  Delete,
  // Req,
  // Res,
  // Headers,
  ParseIntPipe, // "1" => 1 || "youssef" => throw bad request exception
  // ValidationPipe,
} from '@nestjs/common';
// import type { Request, Response } from 'express';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

// l controller bl nestjs bye3ml handle l requests and responses
// DTO: Data Transfer Object

// NOTE:
// class Person{}
// // Is-A Relationship (haydi heritage)
// // Student is a person
// class Student extends Person{}

// class SendEmail{}
// // Has-A Relationship
// // Account has a sendEmail
// class Account{
//   private sendEmail:SendEmail=new SendEmail();
// }

@Controller('api/products')
export class ProductsController {
  // @IMPORT NOTE: this considered as bad practice, we will fix it in the next lession lezm nesta3ml l dependency injection
  // private ProductsService: ProductsService = new ProductsService();

  //Method 1
  // private ProductsService: ProductsService;

  // constructor(ProductsService: ProductsService) {
  //   this.ProductsService = ProductsService;
  // }

  //Method 2 DI (Constructor Injection)
  // l NESTjs mn l DI container la7 ye5od Object mn l product service w ya3ti la haydi l property fi 2alb hayda l class.
  constructor(private readonly ProductsService: ProductsService) {}

  @Post()
  public createNewProduct(
    @Body()
    body: CreateProductDto,
  ) {
    return this.ProductsService.createProduct(body);
  }

  // GET: ~/api/products
  @Get()
  public getAllProducts() {
    return this.ProductsService.getAll();
  }

  // GET: ~/api/products/:id
  @Get(':id')
  public getSingleProducts(@Param('id', ParseIntPipe) id: number) {
    return this.ProductsService.getOneBy(id);
  }

  // PUT: ~/api/products/:id
  @Put(':id')
  public updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.ProductsService.update(id, body);
  }

  // Delete: ~/api/products/:id
  @Delete(':id')
  public deleteProducts(@Param('id', ParseIntPipe) id: number) {
    return this.ProductsService.delete(id);
  }
}
