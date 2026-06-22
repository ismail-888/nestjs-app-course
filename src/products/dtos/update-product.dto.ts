import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsString,
  Min,
  Max,
  Length,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
  // hon mnesta3ml l class ma mnesta3ml "interface" la2n bl class fina ne3ml l validation
  @IsString({ message: 'title should be string, this is custom message' }) // fina neterka fadie betredelna default message
  @IsNotEmpty()
  @Length(2, 150)
  @IsOptional()
  @ApiPropertyOptional({ description: 'title of the product' })
  title?: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  @ApiPropertyOptional({ description: 'description of the product' })
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'price should be greater than 0' })
  @Max(1500)
  @IsOptional()
  @ApiPropertyOptional({ description: 'price of the product' })
  price?: number;
}
