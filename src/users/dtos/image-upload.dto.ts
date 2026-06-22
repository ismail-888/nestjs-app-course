import { ApiProperty } from '@nestjs/swagger';
import type { Express } from 'express';

export class ImageUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    name: 'user-image', // hayda essm l filed li ketbu bl controller bl fileInterceptor.
  })
  file: Express.Multer.File;
}
