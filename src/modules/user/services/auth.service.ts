import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { HttpExceptionMessage } from 'src/shared/enums';
import { Repository } from 'typeorm';
import { SignInDto } from '../dtos';
import { UserEntity } from '../entities';
import { UserRole } from '../enums';
import { AuthResponse } from '../types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(dto: SignInDto): Promise<AuthResponse> {
    const foundUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!foundUser) {
      throw new UnauthorizedException(
        HttpExceptionMessage.USER_DOES_NOT_EXISTS,
      );
    }
    const isValidPassword = await bcrypt.compare(
      dto.password,
      foundUser.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException(HttpExceptionMessage.INVALID_PASSWORD);
    }

    const payload = { id: foundUser.id, email: foundUser.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES'),
    });
    return {
      user: foundUser,
      accessToken,
    };
  }

  async createUser(name: string, password: string, email: string) {
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: UserRole.DEVELOPER,
    });

    await this.userRepository.save(user);
  }
}
