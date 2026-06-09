import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/user.entity';
import { Review } from './reviews/review.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ProductsModule,
    ReviewsModule,
    UploadsModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      // l forRootAsync bisir fina ne3ml injection kerml njib l data mn l .env
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          database: config.get<string>('DB_DATABASE'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          port: config.get<number>('DB_PORT'),
          host: 'localhost',
          synchronize: process.env.NODE_ENV !== 'production', // true only in development. bi7awel l entitys automically to database table mn doun ma e3ml migration
          entities: [Product, User, Review],
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
  ], // hone 3erafna l modules bl app module li houwe you3tabar l parent module
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor, // hek 3mlna l interceptor globaly la7 yeshte8el bi kel l routes massalan ma bedna na3ti l pass lal client
    },
  ],
})
export class AppModule {}
