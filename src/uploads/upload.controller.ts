import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express, Response } from 'express';
import { diskStorage } from 'multer';

@Controller('api/uploads')
export class UploadsController {
  // POST: ~/api/uploads
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images', // here is when we gonna save the file => in "images" folder
        filename: (req, file, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 1000)}`; // exp: 123412341234-262413
          const filename = `${prefix}-${file.originalname}`; // l "file.originalname" is the name of the image that i upload, and we use "prefix" to make it unique
          cb(null, filename); // cb => callback , l "null" is the error, and l "filename" is the name of the file
        },
      }),
      fileFilter(req, file, callback) {
        if (file.mimetype.startsWith('image')) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
      },
      limits: { fileSize: 1024 * 1024 * 5 }, // 5mb
    }), // hayda l file interceptor la7 ye3ml l upload lel files
  )
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    // w ma3 hayda l uploadFile decorator fina njib l file
    if (!file) throw new BadRequestException('no file provided');
    console.log('File uploaded', { file });
    return { message: 'file uploaded successfully' };
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
