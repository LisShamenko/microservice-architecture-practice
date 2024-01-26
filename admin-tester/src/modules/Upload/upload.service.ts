import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { extname, join } from 'path';
// 
import { Directory } from './upload.controller';
import { UserFile } from '../Postgres/entity/UserFile';

// 
@Injectable()
export class UploadService {
    constructor(
        @InjectDataSource('postgres_db') private dataSource: DataSource,
    ) { }

    // 
    async getUserFiles(userId: number) {
        const files = await this.dataSource.getRepository(UserFile)
            .find({
                select: {
                    id: true,
                    url: true,
                    title: true,
                },
                where: {
                    user_id: userId,
                },
            });
        return files;
    }

    async newUserFile(userId: number, url: string, title: string = '') {

        const userFile = new UserFile();
        userFile.user_id = userId;
        userFile.url = url;
        userFile.title = title;
        userFile.is_loaded = false;

        const result = await this.dataSource.getRepository(UserFile)
            .insert(userFile);
        return userFile;
    }

    async confirmFile(userFile: UserFile) {
        userFile.is_loaded = true;
        const result = await this.dataSource.getRepository(UserFile)
            .save(userFile);
        return userFile;
    }

    // 
    getFilePath(directory: string, filename: string) {
        let folder = 'files';
        if (directory === Directory.photo) {
            folder = 'photos';
        }
        else if (directory === Directory.video) {
            folder = 'videos';
        }
        else {
            throw new BadRequestException({ error: 'directory field is invalid' });
        }
        return {
            fullpath: join(__dirname, '../../../public/', folder, filename),
            dbPath: join(folder, filename),
        }
    }

    //      generateFilename(mime: string): string {
    //          // import { extension } from 'mime-types';
    //          const extname = extension(mime);
    //          const randomName = Array(16)
    //              .fill(null)
    //              .map(() => Math.round(Math.random() * 16).toString(16))
    //              .join('');
    //          return `${randomName}.${extname}`;
    //      }

    validateHeaders(headers: Record<any, any>): string {

        if (!headers['content-disposition']) {
            throw new BadRequestException('Content-Disposition header is missing');
        }

        const contentDisposition = headers['content-disposition'];
        const filenameRegex = /^attachment; filename="(.*\..*)"/;

        const isFilenameValid = filenameRegex.test(contentDisposition);
        if (!isFilenameValid) {
            throw new BadRequestException('Content-Disposition header is invalid');
        }

        const [, filename] = contentDisposition.match(filenameRegex);
        if (!filename) {
            throw new BadRequestException('Filename is missing');
        }

        return filename;
    }

    getNewFilename(filename: string): string {
        const name = filename.split('.')[0];
        const extension = extname(filename);
        const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');

        return `${name}_${randomName}${extension}`;
    }

    getFilePathRaw(filename: string) {
        const name = this.getNewFilename(filename);
        const path = `./public/files/${name}`;
        return { name: name, path: path };
    }
}
