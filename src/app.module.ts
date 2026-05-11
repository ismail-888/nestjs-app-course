import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';

@Module({
  imports: [
    ProductsModule,
    ReviewsModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'nestjs-app-db',
      username: 'postgres',
      password: 'Ismail_@bak2025',
      port: 5432,
      host: 'localhost',
      synchronize: true, // only in development. bi7awel l entitys automically to database table mn doun ma e3ml migration
      entities: [Product],
    }),
  ], // hone 3erafna l modules bl app module li houwe you3tabar l parent module
})
export class AppModule {}
