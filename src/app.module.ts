import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ProductsModule, ReviewsModule, UsersModule], // hone 3erafna l modules bl app module li houwe you3tabar l parent module
})
export class AppModule {}
