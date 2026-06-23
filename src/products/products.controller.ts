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
  ParseIntPipe,
  UseGuards,
  Query, // "1" => 1 || "youssef" => throw bad request exception
  // ValidationPipe,
} from '@nestjs/common';
// import type { Request, Response } from 'express';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

// import { ConfigService } from '@nestjs/config';

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
// @SkipThrottle() // ye3ni hala2 l "Rate limit" ma 7a yeshte8el 3a kll routes
@ApiTags('Products Group') // is badi 8ayer l essm bl swagger
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
  constructor(
    private readonly ProductsService: ProductsService,
    // private readonly config: ConfigService,
  ) {}

  @Post()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  @ApiSecurity('bearer')
  public createNewProduct(
    @Body()
    body: CreateProductDto,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.ProductsService.createProduct(body, payload.id);
  }

  // GET: ~/api/products
  @Get()
  @ApiResponse({ status: 200, description: 'products fetched successfully' })
  @ApiOperation({ summary: ' Get a collection of products' })
  @ApiQuery({
    name: 'title',
    required: false,
    type: 'string',
    description: 'search base on product title',
    example: 'lapotp',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: 'string',
    description: 'minimum price',
    example: '100',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: 'string',
    description: 'maximum price',
    example: '200',
  })
  public getAllProducts(
    @Query('title') title: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
  ) {
    // 3m ne3ml destruction 3m ne5od bas l title mn l url w akid bikoun string
    // const sample = this.config.get<string>('SAMPLE');// bl controller wl service haydi l tari2a a7ssan
    // const sample1 = process.env.SAMPLE;
    // console.log({ sample, sample1 });
    return this.ProductsService.getAll(title, minPrice, maxPrice);
  }

  // GET: ~/api/products/:id
  @Get(':id')
  @SkipThrottle() // ye3ni hala2 l "Rate limit" ma 7a yeshte8el 3a haydi l route
  @Throttle({ default: { limit: 5, ttl: 10000 } }) // hon iza badi 8ayer l "rate limit" setting la route mou3ayan 3mlna "override"
  public getSingleProducts(@Param('id', ParseIntPipe) id: number) {
    return this.ProductsService.getOneBy(id);
  }

  // PUT: ~/api/products/:id
  @Put(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  @ApiSecurity('bearer')
  public updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.ProductsService.update(id, body);
  }

  // Delete: ~/api/products/:id
  @Delete(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  @ApiSecurity('bearer')
  public deleteProducts(@Param('id', ParseIntPipe) id: number) {
    return this.ProductsService.delete(id);
  }
}
