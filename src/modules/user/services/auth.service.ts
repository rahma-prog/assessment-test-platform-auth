import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignInDto } from '../dtos';
import { UserEntity } from '../entities';
import { AuthResponse } from '../types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signIn(dto: SignInDto): Promise<AuthResponse> {
    const foundUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    return {
      user: foundUser,
      accessToken: 'sdfkhfd',
    };
  }
}
