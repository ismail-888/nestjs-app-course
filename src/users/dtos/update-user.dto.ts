import { IsOptional, IsString, Length, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(6)
  @IsOptional()
  password: string;

  @IsOptional()
  @IsString()
  @Length(2, 150)
  username: string;
}
