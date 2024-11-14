import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService:JwtService,
    private readonly reflector:Reflector
  ) {
    
  }
 async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
      const isPublic= this.reflector.getAllAndOverride<boolean>("isPublic",[
        context.getHandler(),
        context.getClass()
      ]);
      if(isPublic) return true;
  }
}
