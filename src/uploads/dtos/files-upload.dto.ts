import { ApiProperty } from '@nestjs/swagger';
// import type { Express } from 'express';

export class FilesUplaodDto {
  @ApiProperty({
    type: 'array',
    name: 'files',
    items: { type: 'string', format: 'binary' },
  })
  files: Array<Express.Multer.File>;
}
