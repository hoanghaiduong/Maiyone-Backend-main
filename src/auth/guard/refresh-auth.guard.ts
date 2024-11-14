import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class RefreshAuthGuard extends AuthGuard("refresh"){
 constructor(
  private reflector:Reflector
 ) {
    super();
 }
}
