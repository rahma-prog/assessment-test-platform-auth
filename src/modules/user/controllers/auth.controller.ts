import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { SignInDto } from '../dtos';
import { AuthService } from '../services';
import { jwtAuthGuard } from '../guards';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(jwtAuthGuard)
  getAuthenticated(@Request() req) {
    return req.user;
  }

  @Post('/sign-in')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Post('/test/create-user')
  createUser() {
    return this.authService.createUser('Rahma', 'Test@123', 'rahma@gmail.com');
  }
}

export class UsersController {
  @Get()
  @UseGuards(jwtAuthGuard)
  findAll(@Req() req) {
    return req.auth;
  }
}
