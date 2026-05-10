import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
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

type ProductType = { id: number; title: string; price: number };

// l controller bl nestjs bye3ml handle l requests and responses
// DTO: Data Transfer Object

@Controller('api/products')
export class ProductsController {
  private products: ProductType[] = [
    { id: 1, title: 'Product 1', price: 100 },
    { id: 2, title: 'Product 2', price: 200 },
    { id: 3, title: 'Product 3', price: 300 },
  ];

  //POST: ~/api/products/express-way
  // @Post('express-way')
  // public createNewProductExpressWay(
  //   @Req() req: Request,
  //   @Res({ passthrough: true }) res: Response,
  //   @Headers() headers: any,
  // ) {
  //   const newProduct: ProductType = {
  //     id: this.products.length + 1,
  //     title: req.body.title,
  //     price: req.body.price,
  //   };
  //   this.products.push(newProduct);
  //   console.log(headers);
  //   console.log(req.headers); // nafess li fo2 bas akid l best pratcie enu nesta5dem l decorator @Headers
  //   res.status(201).json(newProduct);

  //   // res.cookie('authCookie', 'this is a cookie', {
  //   //   httpOnly: true,
  //   //   maxAge: 120,
  //   // });
  // }

  //POST: ~/api/products
  @Post() // this is the best pratice not the express way
  public createNewProduct(
    @Body()
    body: CreateProductDto,
    // hon mnesta3ml "whitelist: true" kerml ma ne5od mn l server l properties ma mne7teja
    // hon mnesta3ml "forbidNonWhitelisted: true" iza l server ba3atlna properties ma bedna yeha bta3tina error (bad request)
    // kerml ma kelshwai netkob l validation la kel request fa mnektbon bl "main.ts" bisuru gloably.
  ) {
    const newProduct: ProductType = {
      id: this.products.length + 1,
      title: body.title,
      price: body.price,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  // GET: ~/api/products
  @Get()
  public getAllProducts() {
    return this.products;
  }

  // GET: ~/api/products/:id
  @Get(':id')
  public getSingleProducts(@Param('id', ParseIntPipe) id: number) {
    // bas 7etayna l 'id' bi 2alb l @Param haydi essma distructuring ye3ni a5adna bas l id
    // aya shi be5du mn l url bikoun string
    console.log(typeof id);
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`, {
        description: 'Product not found',
      });
    }
    return product;
  }

  // PUT: ~/api/products/:id
  @Put(':id')
  public updateProduct(
    @Param('id', ParseIntPipe) id: string,
    @Body() body: UpdateProductDto,
  ) {
    const product = this.products.find((p) => p.id === parseInt(id));
    if (!product) throw new NotFoundException('product not found');

    console.log(body);
    return { message: 'product updated successfully with id ' + id };
  }

  // Delete: ~/api/products/:id
  @Delete(':id')
  public deleteProducts(@Param('id', ParseIntPipe) id: string) {
    // bas 7etayna l 'id' bi 2alb l @Param haydi essma distructuring ye3ni a5adna bas l id
    // aya shi be5du mn l url bikoun string
    const product = this.products.find((p) => p.id === parseInt(id));
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    return { message: 'product deleted' };
  }
}
