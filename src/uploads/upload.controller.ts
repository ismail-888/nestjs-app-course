import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import type { Express, Response } from 'express';
import { FilesUplaodDto } from './dtos/files-upload.dto';

@Controller('api/uploads')
export class UploadsController {
  // POST: ~/api/uploads
  @Post()
  @UseInterceptors(
    FileInterceptor('file'), // hayda l file interceptor la7 ye3ml l upload lel files
  )
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    // w ma3 hayda l uploadFile decorator fina njib l file
    if (!file) throw new BadRequestException('no file provided');
    console.log('File uploaded', { file });
    return { message: 'file uploaded successfully' };
  }

  // POST: ~/api/uploads/multiple-files
  @Post('multiple-files')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FilesUplaodDto,
    description: 'uploading multiple iamges example',
  })
  public uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    // w ma3 hayda l uploadFile decorator fina njib l file
    if (!files || files.length === 0)
      throw new BadRequestException('no file provided');
    console.log('File uploaded', { files });
    return { message: 'files uploaded successfully' };
  }

  // GET: ~/api/uploads/:image
  @Get(':image')
  public showUploadedImage(
    @Param('image') image: string,
    @Res() res: Response,
  ) {
    return res.sendFile(image, { root: 'images' }); // ye3ni jib l image variable mn l "images" folder
  }
}
