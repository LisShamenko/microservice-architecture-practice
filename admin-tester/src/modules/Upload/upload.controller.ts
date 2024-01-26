import { Body, Controller, Get, Post, Req, BadRequestException, Param } from '@nestjs/common';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { writeFileSync } from 'fs';
import fs from 'fs/promises';
// 
import { UploadInterceptor } from './interceptors/UploadInterceptor';
import { UploadService } from './upload.service';
import { Unprotected } from 'nest-keycloak-connect';
import { FileExtender } from './interceptors/FileExtender';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

// 
interface BufferBody extends Omit<Request, 'body'> {
    body: Buffer;
}

type BodyDto = {
    document: string,
}

export enum Directory {
    photo = 'photo',
    video = 'video',
}

type DocumentDto = {
    directory: Directory,
    user_id: number,
    title?: string,
}

// 
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Get()
    @Unprotected()
    async getFiles(@Param('user_id') userId: number) {
        return await this.uploadService.getUserFiles(userId);
    }

    @Post()
    @Unprotected()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Body() body: BodyDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const doc: DocumentDto = JSON.parse(body.document);
        const paths = this.uploadService.getFilePath(doc.directory, file.originalname);
        const userFile = await this.uploadService.newUserFile(doc.user_id, paths.dbPath, doc.title);

        try {
            await fs.writeFile(paths.fullpath, file.buffer);
            await this.uploadService.confirmFile(userFile);
            return { id: 0 };
        }
        catch (err) {
            throw new BadRequestException({ error: err.message });
        }
    }

    // 
    @UseInterceptors(FileExtender, UploadInterceptor)
    async uploadPhotos(@UploadedFile() file: Express.Multer.File,) {
        return { filename: file.filename };
    }

    @Post('/raw')
    async uploadRawFile(@Req() req: BufferBody) {
        const buffer = req.body;
        const filename = this.uploadService.validateHeaders(req.headers);
        const filepath = this.uploadService.getFilePathRaw(filename);
        writeFileSync(filepath.path, buffer);
        return { filename: filepath.name };
    }
}
