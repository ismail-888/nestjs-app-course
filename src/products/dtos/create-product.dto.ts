import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsString,
  Min,
  // MinLength,
  // MaxLength,
  Max,
  Length,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  // hon mnesta3ml l class ma mnesta3ml "interface" la2n bl class fina ne3ml l validation
  @IsString({ message: 'title should be string, this is custom message' }) // fina neterka fadie betredelna default message
  @IsNotEmpty()
  // @MinLength(2)
  // @MaxLength(150)
  @Length(2, 150) // this is the same as @MinLength(2) @MaxLength(150)
  @ApiProperty({ description: 'title of the product' })
  title: string;

  @IsString()
  @MinLength(5)
  @ApiProperty({ description: 'description of the product' })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'price should be greater than 0' })
  @Max(1500)
  @ApiProperty({ description: 'price of the product' })
  price: number;
}
