import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [UsersModule, TypeOrmModule.forFeature([Product]), JwtModule], // hon 3m nesta3ml l users service bl product fa 3mlnela import
})
export class ProductsModule {}
