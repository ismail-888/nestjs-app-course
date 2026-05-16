import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
// import { ReviewsService } from 'src/reviews/reviews.service';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    // private readonly reviewsService: ReviewsService,
  ) {}

  // POST: ~/api/users/auth/register
  @Post('auth/register')
  public register(@Body() body: RegisterDto) {
    return this.usersService.register(body);
  }

  // POST: ~/api/users/auth/login
  @Post('auth/login') // l status by default hon is 201
  @HttpCode(HttpStatus.OK) // bas ne3ml hek bisir l status code 200
  public login(@Body() body: LoginDto) {
    return this.usersService.login(body);
  }
}
