import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [UsersModule], // hon 3m nesta3ml l users service bl product fa 3mlnela import
})
export class ProductsModule {}
