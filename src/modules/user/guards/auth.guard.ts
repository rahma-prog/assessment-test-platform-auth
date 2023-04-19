import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class jwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];

      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });
      req.user = decoded;
      return true;
    } catch (err) {
      return false;
    }
  }
}
