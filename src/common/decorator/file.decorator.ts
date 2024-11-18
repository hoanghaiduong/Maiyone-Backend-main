import { applyDecorators, UnsupportedMediaTypeException, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiConsumes } from "@nestjs/swagger";
import {MulterField, MulterOptions} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { Request } from "express";
import { diskStorage, memoryStorage } from "multer";
import { FileTypes } from "../enum";
import { CodeUtil } from "../utils/code.util";
import { existsSync, mkdirSync } from "fs";
import { v4 as uuid } from 'uuid';
import { extname } from "path";



export const ApiMemoryFile = (
  fieldName: string = "file",
  minType: FileTypes = FileTypes.IMAGE
) => {
  return applyDecorators(
    //show buffer
    UseInterceptors(FileInterceptor(fieldName, {
      fileFilter: fileMimetypeFilter(CodeUtil.getMineType(minType)),
      storage: memoryStorage(),
      preservePath: true
    })),
    ApiConsumes("multipart/form-data")
  );
};

export const ApiMemoryFiles = (
  fieldName: string = "files",
  maxCount: number = 10,
  minType: FileTypes = FileTypes.IMAGE
) => {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(fieldName, maxCount, {
      fileFilter: fileMimetypeFilter(CodeUtil.getMineType(minType)),
      storage: memoryStorage(),
      preservePath: true
    })),
    ApiConsumes("multipart/form-data")
  );
};

export const ApiFiles = (fieldName : string , maxCount : number  , localOptions : MulterOptions = {} ) => {
    return applyDecorators(UseInterceptors(FilesInterceptor(fieldName, maxCount, localOptions)), ApiConsumes("multipart/form-data"));
}

export const ApiFile = (fieldName : string , localOptions : MulterOptions = {} ) => {
    return applyDecorators(UseInterceptors(FileInterceptor(fieldName, localOptions)), ApiConsumes("multipart/form-data"));
}





export const ApiFileFields = (
  uploadFields: MulterField[],
  minType: FileTypes = FileTypes.IMAGE,
  localOptions: MulterOptions = {}
) => {
  return applyDecorators(
    UseInterceptors(FileFieldsInterceptor(uploadFields, {
      ...localOptions,
      fileFilter: fileMimetypeFilter(CodeUtil.getMineType(minType)),
    })),
    ApiConsumes('multipart/form-data')
  );
};


export const fileMimetypeFilter = (mimetypes: string[]) => {
  return (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
    console.log(file.mimetype + " " + mimetypes);
    if (mimetypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new UnsupportedMediaTypeException("File type not supported"), false);
    }
  };
};