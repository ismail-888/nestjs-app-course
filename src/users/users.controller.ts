import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';
import { Roles } from './decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { AuthRolesGuard } from './guards/auth-roles.guard';
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

  // GET: ~/api/users/current-user
  @Get('current-user')
  @UseGuards(AuthGuard)
  public getCurrentUser(@CurrentUser() payload: JWTPayloadType) {
    return this.usersService.getCurrentUser(payload.id);
  }

  // GET: ~/api/users
  @Get()
  @Roles(UserType.ADMIN) // hon bas badi l admin ye7ssal 3ala hayda l route iza bedna role teni fina nzid "UserType.NORMAL_USER"
  @UseGuards(AuthRolesGuard) // lezm nesta3ml l "Roles" decorator kerml njib l user type iza ma 3mlna hek bya3ti error
  public getAllUsers() {
    return this.usersService.getAll();
  }
}
