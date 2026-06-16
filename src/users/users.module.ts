import { BadRequestException, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
// import { ReviewsModule } from 'src/reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { AuthProvider } from './auth.provider';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MailModule } from 'src/mail/mail.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthProvider],
  exports: [UsersService], // hon la2n 3m nesta3ml l user service bl product service
  // imports: [forwardRef(() => ReviewsModule), TypeOrmModule.forFeature([User])], // bas ykoun fi e3timad da2iri (circule) ye3ni 3m besta3ml l usersService bl reviews, w 3m besta3ml l reviewsService bl users fa bi hal 7ale mnesta3ml l "forwardRef"
  imports: [
    MailModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<string>('JWT_EXPIRES_IN') as StringValue,
        },
      }),
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './images/users',
        filename: (req, file, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 1000)}`;
          const filename = `${prefix}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('unsupported file format'), false);
        }
      },
      limits: { fileSize: 1024 * 1024 * 1 }, // 1mb
    }),
  ],
})
export class UsersModule {}
