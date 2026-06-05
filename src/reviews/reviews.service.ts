// import { Injectable, Inject, forwardRef } from '@nestjs/common';
// import { UsersService } from 'src/users/users.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { CreateReviewDto } from './dtos/create-review.dto';

// iza badi esta5dem l users service bl reviews service lezm nesta3ml l "Inject" decorator wl "forwardRef" function.
// ama bl reviews controller mafi de3i la 2ilon.

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly productService: ProductsService,
    private readonly usersService: UsersService,
    // @Inject(forwardRef(() => UsersService))
  ) {}

  /**
   * Create new review
   * @param productId  id of the product
   * @param userId  if of the user that created this review
   * @param dto  data for creating new review
   * @returns  the created review from the database
   */
  public async createReview(
    productId: number,
    userId: number,
    dto: CreateReviewDto,
  ) {
    const product = await this.productService.getOneBy(productId);
    const user = await this.usersService.getCurrentUser(userId);

    const review = this.reviewsRepository.create({ ...dto, user, product });
    const result = await this.reviewsRepository.save(review);
    return {
      id: result.id,
      comment: result.comment,
      rating: result.rating,
      createdAt: result.createdAt,
      userId: user.id,
      productId: product.id,
    };
  }
}
