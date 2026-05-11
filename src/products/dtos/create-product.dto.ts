import {
  IsNumber,
  IsNotEmpty,
  IsString,
  Min,
  // MinLength,
  // MaxLength,
  Max,
  Length,
} from 'class-validator';

export class CreateProductDto {
  // hon mnesta3ml l class ma mnesta3ml "interface" la2n bl class fina ne3ml l validation
  @IsString({ message: 'title should be string, this is custom message' }) // fina neterka fadie betredelna default message
  @IsNotEmpty()
  // @MinLength(2)
  // @MaxLength(150)
  @Length(2, 150) // this is the same as @MinLength(2) @MaxLength(150)
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'price should be greater than 0' })
  @Max(15)
  price: number;
}
