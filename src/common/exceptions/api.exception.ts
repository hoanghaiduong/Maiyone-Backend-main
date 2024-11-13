import { HttpException } from '@nestjs/common';
import { IError } from '../interfaces/exception';

export class ApiException extends HttpException {
  code: string;
  constructor(error: IError, message?: string) {
    super(error.message, error.status);
    this.message = message || error.message;
    this.code = error.code;
  }
}
