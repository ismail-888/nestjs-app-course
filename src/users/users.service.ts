// import { forwardRef, Inject, Injectable } from '@nestjs/common';
// import { ReviewsService } from 'src/reviews/reviews.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { LoginDto } from './dtos/login.dto';
import {
  // AccessTokenType,
  JWTPayloadType,
} from 'src/utils/types';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserType } from 'src/utils/enums';
import { AuthProvider } from './auth.provider';
import { join } from 'node:path';
import { existsSync, unlinkSync } from 'node:fs';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly authProvider: AuthProvider,
  ) {}

  /**
   * Create new user
   * @param registerDto data for creating new user
   * @returns JWT (access token)
   */

  public async register(registerDto: RegisterDto) {
    return this.authProvider.register(registerDto);
  }

  /**
   * Log In user
   * @param loginDto data for login to user account
   * @returns JWT (access token)
   */

  public async login(loginDto: LoginDto) {
    return this.authProvider.login(loginDto);
  }

  /**
   * get current user (logged in user)
   * @param id id of the logged in user
   * @returns the user from the database
   */
  public async getCurrentUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  /**
   * Get all users from the database
   * @returns collection of users
   */
  public getAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Update user
   * @param id  id of the logged in user
   * @param updateUserDto data for updating the user
   * @returns  updated user from the database
   */
  public async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, username } = updateUserDto;
    // 1. Fetch the user
    const user = await this.usersRepository.findOne({ where: { id } });

    // 2. Guard Clause: Check if the user exists
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // 3. TypeScript now knows 'user' is 100% NOT null, so this is safe:
    user.username = username ?? user.username;
    if (password) {
      user.password = await this.authProvider.hashPassword(password);
    }
    return this.usersRepository.save(user);
  }

  /**
   * Delete user
   * @param userId id of the user
   * @param payload JWTPayload
   * @returns a success message
   */
  public async delete(userId: number, payload: JWTPayloadType) {
    const user = await this.getCurrentUser(userId);

    // if (user.id === payload?.id || payload.userType === UserType.ADMIN) {
    //   await this.usersRepository.remove(user);
    //   return { message: 'User has been removed' };
    // }
    // 2. Perform authorization check
    const isOwner = user.id === Number(payload?.id);
    const isAdmin = payload.userType === UserType.ADMIN;

    if (isOwner || isAdmin) {
      // TypeORM .remove() deletes the entity instance from the database
      await this.usersRepository.remove(user);
      return { message: 'User has been removed' };
    }

    throw new ForbiddenException('access denied, you are not allowed');
  }

  /**
   * Set Profile iamge
   * @param userId id of the loagged in user
   * @param newProfileImage profile image
   * @returns the user from the database
   */
  public async setProfileImage(userId: number, newProfileImage: string) {
    const user = await this.getCurrentUser(userId);

    // if (user.profileImage === null) {
    //   user.profileImage = newProfileImage;
    // } else {
    //   await this.removeProfileImage(userId);
    //   user.profileImage = newProfileImage;
    // }

    // If they have an old image listed in the database, try to clean it up
    if (user.profileImage) {
      this.deleteImageFromDisk(user.profileImage);
    }

    // Safely assign the new image and save to database
    user.profileImage = newProfileImage;
    return this.usersRepository.save(user);
  }

  /**
   * Remove Profile image
   * @param userId id of the logged in user
   * @returns the user form the database
   */
  public async removeProfileImage(userId: number) {
    const user = await this.getCurrentUser(userId);
    if (user.profileImage === null)
      throw new BadRequestException('there is no profile image');

    const imagePath = join(
      process.cwd(),
      `./images/users/${user.profileImage}`,
    );
    unlinkSync(imagePath); // delete the image

    user.profileImage = null;
    return this.usersRepository.save(user);
  }

  /**
   * Verify Email
   * @param userId id of the user from the link
   * @param verificationToken verification token from the link
   * @returns success message
   */
  public async verifyEmail(userId: number, verificationToken: string) {
    const user = await this.getCurrentUser(userId);
    if (user.verificationToken === null)
      throw new NotFoundException('there is no verification token');
    if (user.verificationToken !== verificationToken)
      throw new BadRequestException('invalid link');

    user.isAccountVerified = true;
    user.verificationToken = null;
    await this.usersRepository.save(user);
    return {
      message: 'Your email has been verified , please log in to your account',
    };
  }

  /**
   * Sending reset password template
   * @param email email of the user
   * @returns a success message
   */
  public sendResetPassowrd(email: string) {
    return this.authProvider.sendResetPasswordLink(email);
  }

  /**
   * Get reset password link
   * @param userId user id from the link
   * @param resetPasswordToken reset password token from the link
   * @returns a success message
   */
  public getResetPassword(userId: number, resetPasswordToken: string) {
    return this.authProvider.getResetPasswordLink(userId, resetPasswordToken);
  }

  /**
   * Reset the password
   * @param dto data for reset the password
   * @returns a success message
   */
  public resetPassword(dto: ResetPasswordDto) {
    return this.authProvider.resetPassword(dto);
  }

  // 2. This safe helper will NEVER crash your server
  private deleteImageFromDisk(filename: string) {
    const imagePath = join(process.cwd(), `./images/users/${filename}`);

    // Check if the file is physically there first!
    if (existsSync(imagePath)) {
      unlinkSync(imagePath); // Only delete it if it exists
    } else {
      console.log(
        `File ${filename} was already gone from disk, skipping unlink.`,
      );
    }
  }
}
