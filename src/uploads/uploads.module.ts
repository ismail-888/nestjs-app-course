import { BadRequestException, Module } from '@nestjs/common';
import { UploadsController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  controllers: [UploadsController],
  imports: [
    MulterModule.register({
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
    }),
  ], // fina nshil "MulterModule.register()" la2n 7etayna l settings bl controller, bas l 2afdal n7eton hon metel ma 3mlna
})
export class UploadsModule {}
