import { Injectable, NestInterceptor } from '@nestjs/common';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
// 
import { UploadService } from '../upload.service';

// 
@Injectable()
export class UploadInterceptor implements NestInterceptor {
    constructor(private readonly uploadService: UploadService) { }

    intercept(context: ExecutionContext, next: CallHandler) {

        const Interceptor = FileInterceptor('file', {
            storage: diskStorage({
                destination: './public/files',
                filename: (_req, file, callback) => {
                    const newFilename = this.uploadService
                        .getNewFilename(file.originalname);
                    callback(null, newFilename);
                },
            }),
        });
        const uploadInterceptor = new Interceptor();

        return uploadInterceptor.intercept(context, next);
    }
}
