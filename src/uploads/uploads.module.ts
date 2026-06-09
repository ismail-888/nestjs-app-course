import { Module } from '@nestjs/common';
import { UploadsController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [UploadsController],
  imports: [MulterModule.register()],
})
export class UploadsModule {}
