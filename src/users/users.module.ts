import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // hon la2n 3m nesta3ml l user service bl product service
  imports: [forwardRef(() => ReviewsModule)], // bas ykoun fi e3timad da2iri ye3ni 3m besta3ml l usersService bl reviews, w 3m besta3ml l reviewsService bl users fa bi hal 7ale mnesta3ml l "forwardRef"
})
export class UsersModule {}
