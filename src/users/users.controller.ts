import {
  BadRequestException,
  Body,
  // ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  // UseInterceptors,
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
import { UpdateUserDto } from './dtos/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
import type { Response } from 'express';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
// import { LoggerInterceptor } from 'src/utils/interceptors/logger.interceptor';
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
  // @UseInterceptors(LoggerInterceptor)
  // @UseInterceptors(ClassSerializerInterceptor) // la2n 3mlna l interceptor globaly sar fina manektba hon
  public getCurrentUser(@CurrentUser() payload: JWTPayloadType) {
    // console.log('Get Current User Route Handler Route');
    return this.usersService.getCurrentUser(payload.id);
  }

  // GET: ~/api/users
  @Get()
  @Roles(UserType.ADMIN) // hon bas badi l admin ye7ssal 3ala hayda l route iza bedna role teni fina nzid "UserType.NORMAL_USER"
  @UseGuards(AuthRolesGuard) // lezm nesta3ml l "Roles" decorator kerml njib l user type iza ma 3mlna hek bya3ti error
  // @UseInterceptors(ClassSerializerInterceptor) // la2n 3mlna l interceptor globaly sar fina manektba hon
  public getAllUsers() {
    return this.usersService.getAll();
  }

  // PUT: ~/api/users
  @Put()
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  public updateUser(
    @CurrentUser() payload: JWTPayloadType,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(payload.id, body);
  }

  // DELETE: ~/api/users/:id
  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  public deleteUser(
    @Param('id', ParseIntPipe) id: number, //ParseIntPipe usage: URLs pass parameters as strings (e.g., "/api/users/12" delivers "12"). By using @Param('id', ParseIntPipe), NestJS automatically converts that string into a proper JavaScript number before passing it to your service.
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.usersService.delete(id, payload);
  }

  // POST: ~/api/users/upload-image
  @Post('upload-image')
  @UseGuards(AuthGuard) // hayda bye3ml verify lal token
  @UseInterceptors(FileInterceptor('user-image'))
  public uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    if (!file) throw new BadRequestException('no file provided');
    return this.usersService.setProfileImage(payload.id, file.filename);
  }

  // DELETE : ~/api/users/images/remove-profile-image
  @Delete('/images/remove-profile-image')
  @UseGuards(AuthGuard)
  public removeProfileImage(@CurrentUser() payload: JWTPayloadType) {
    // return this.usersService.removeProfileImage(payload.id);
    return this.usersService.removeProfileImage(payload.id);
  }

  // GET: ~/api/users/images/:image
  @Get('/images/:image')
  @UseGuards(AuthGuard)
  public showProfileImage(@Param('image') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: 'images/users' });
  }

  // GET: ~/api/users/verify-email/:id/:verificationToken
  @Get('verify-email/:id/:verificationToken')
  public verifyEmail(
    @Param('id', ParseIntPipe) id: number,
    @Param('verificationToken') verificationToken: string,
  ) {
    return this.usersService.verifyEmail(id, verificationToken);
  }

  //POST: ~/api/users/forgot-password
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  public forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.usersService.sendResetPassowrd(body.email);
  }

  // GET: ~/api/users/reset-password/:id/:resetPasswordToken
  @Get('reset-password/:id/:resetPasswordToken')
  public getResetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Param('resetPasswordToken') resetPasswordToken: string,
  ) {
    return this.usersService.getResetPassword(id, resetPasswordToken);
  }

  // POST: ~/api/users/reset-password
  @Post('reset-password')
  public resetPassword(@Body() body: ResetPasswordDto) {
    return this.usersService.resetPassword(body);
  }
}
