import { HttpException, HttpStatus } from '@nestjs/common';
import { extname, resolve } from 'path';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import * as process from 'process';
import { ImagePath } from '../enum';

export enum UploadTypesEnum {
  ANY = 'jpg|jpeg|png|gif|pdf|docx|doc|xlsx|xls',
  IMAGES = 'jpg|jpeg|png|gif',
  DOCS = 'pdf|docx|doc|xlsx|xls',
  IMAGES_AND_VIDEOS = 'jpg|jpeg|png|gif|mp4|mov|avi|wmv|flv|3gp|mkv',
}

export class MulterUtils {
  /**
   * Config for allowed files
   *
   * @static
   * @param {UploadTypesEnum} filesAllowed // 👈 tạo enum để lọc file muốn upload
   * @param path  // 👈 tạo enum path để lưu file vào đúng thư mục
   * @returns
   * @memberof MulterUtils
   */
  public static getConfig(filesAllowed: UploadTypesEnum, path: ImagePath) {
    return {
      // Enable file size limits
      limits: {
        //  fileSize: +process.env.MAX_FILE_SIZE * 1024 * 1024,
        // fileSize: 20 * 1024 * 1024,
      },
      // Check the mimetypes to allow for upload
      fileFilter: (req: any, file: any, cb: any) => {
        console.log(file.mimetype);
        if (file.mimetype.match(`/(${filesAllowed})$`)) {
          // Allow storage of file
          cb(null, true);
        } else {
          // Reject file
          cb(
            new HttpException(
              `Unsupported file type ${extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
      // Storage properties
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          const uploadPath = `${process.env.UPLOAD_LOCATION}/${path}`;
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        // File modification details
        filename: (req: any, file: any, cb: any) => {
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    };
  }

  // static deleteFile(image: string) {
  //   if (existsSync(`${'public'}/${image}`)) {
  //     console.log('Deleting file' + image);
  //     fs.unlinkSync(`${'public'}/${image}`);
  //   }
  // }

  // static deleteFiles(images: string[]) {
  //   console.log(images)
  //   images.forEach((image) => {
  //     if (existsSync(`${'public'}/${image}`)) {
  //       fs.unlinkSync(`${'public'}/${image}`);
  //     }
  //   });
  // }
  static deleteFile(imagePath: string): void {
    const fullPath = resolve(imagePath); // Xây dựng đường dẫn đầy đủ
    console.log(fullPath)
    try {
      if (fs.existsSync(fullPath)) {
        console.log(`Deleting file: ${fullPath}`);
        fs.unlinkSync(fullPath);
      } else {
        console.warn(`File not found: ${fullPath}`);
      }
    } catch (error) {
      console.error(`Failed to delete file: ${fullPath}`, error);
    }
  }

  static deleteFiles(imagePaths: string[]): void {
    imagePaths.forEach((imagePath) => {
      const fullPath = resolve(imagePath); // Xây dựng đường dẫn đầy đủ
      try {
        if (fs.existsSync(fullPath)) {
          console.log(`Deleting file: ${fullPath}`);
          fs.unlinkSync(fullPath);
        } else {
          console.warn(`File not found: ${fullPath}`);
        }
      } catch (error) {
        console.error(`Failed to delete file: ${fullPath}`, error);
      }
    });
  }
  static convertArrayPathToUrl(paths: string[]) {
    // return  path.replace(/\\/g, '/').replace('public', '');
    return paths.map(
      (path) => `${path.replace(/\\/g, '/').replace('public', '')}`,
    );
  }

  static convertPathToUrl(path: string | undefined) {
    if (!path) {
      throw new Error('Path is undefined or invalid.');
    }
    return path.replace(/\\/g, '/').replace('public', '');
  }
}
