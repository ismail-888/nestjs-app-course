import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/user.entity';
import { Review } from './reviews/review.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UploadsModule } from './uploads/uploads.module';
import { MailModule } from './mail/mail.module';
import { LoggerMiddleware } from './utils/middlewares/logger.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
// import helmet from 'helmet';

@Module({
  imports: [
    ProductsModule,
    ReviewsModule,
    UploadsModule,
    UsersModule,
    MailModule,
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
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 4000, // 4 seconds
        limit: 3, // 3 request every 4 seconds for a client
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 7, // 7 request every 10 seconds for a client
      },
      {
        name: 'long',
        ttl: 60000, // 60 seconds
        limit: 15, // 15 request every 60 seconds for a client
      },
    ]),
  ], // hone 3erafna l modules bl app module li houwe you3tabar l parent module
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor, // hek 3mlna l interceptor globaly la7 yeshte8el bi kel l routes massalan ma bedna na3ti l pass lal client
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'api/products', method: RequestMethod.POST })
      .forRoutes(
        {
          // path: '*', // ye3ni l middleware byeshte8el la kel l route "users, product, review.."
          path: 'api/products',
          // method: RequestMethod.ALL,
          method: RequestMethod.GET,
        },
        // {
        //   path: 'api/products',
        //   method: RequestMethod.DELETE,
        // },
      );
    // consumer
    //   .apply(helmet())
    //   .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
