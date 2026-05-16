import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
// import { ReviewsModule } from 'src/reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  // exports: [UsersService], // hon la2n 3m nesta3ml l user service bl product service
  // imports: [forwardRef(() => ReviewsModule), TypeOrmModule.forFeature([User])], // bas ykoun fi e3timad da2iri (circule) ye3ni 3m besta3ml l usersService bl reviews, w 3m besta3ml l reviewsService bl users fa bi hal 7ale mnesta3ml l "forwardRef"
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
