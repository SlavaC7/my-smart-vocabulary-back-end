import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
      request['user'] = decodedToken;

      console.log('Decoded Token =>', decodedToken);
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
