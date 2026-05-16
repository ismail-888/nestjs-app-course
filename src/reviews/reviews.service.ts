// import { Injectable, Inject, forwardRef } from '@nestjs/common';
// import { UsersService } from 'src/users/users.service';
import { Injectable } from '@nestjs/common';

// iza badi esta5dem l users service bl reviews service lezm nesta3ml l "Inject" decorator wl "forwardRef" function.
// ama bl reviews controller mafi de3i la 2ilon.

@Injectable()
export class ReviewsService {
  constructor() {
    // @Inject(forwardRef(() => UsersService))
    // private readonly usersService: UsersService,
  }

  public getAll() {
    return [
      { id: 1, rating: 5, comment: 'Review 1' },
      { id: 2, rating: 4, comment: 'Review 2' },
    ];
  }
}
