import {
  IsNumber,
  IsNotEmpty,
  IsString,
  Min,
  Max,
  Length,
  IsOptional,
} from 'class-validator';

export class UpdateProductDto {
  // hon mnesta3ml l class ma mnesta3ml "interface" la2n bl class fina ne3ml l validation
  @IsString({ message: 'title should be string, this is custom message' }) // fina neterka fadie betredelna default message
  @IsNotEmpty()
  @Length(2, 150)
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'price should be greater than 0' })
  @Max(15)
  @IsOptional()
  price?: number;
}
