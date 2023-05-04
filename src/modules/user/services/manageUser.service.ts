import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { HttpExceptionMessage } from 'src/shared/enums';
import { Not, Repository } from 'typeorm';
import { UserDto } from '../dtos/user.dto';
import { UserEntity } from '../entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async createUser(userDto: UserDto): Promise<UserEntity> {
    await this.validateEmailExistence(userDto.email);
    const user = this.userRepository.create({
      ...userDto,
      password: await bcrypt.hash(userDto.password, 8),
    });
    return this.userRepository.save(user);
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async updateUser(id: string, userDto: UserDto): Promise<UserEntity> {
    await this.validateEmailExistence(userDto.email, id);
    const user = await this.getUserById(id);
    user.name = userDto.name;
    user.email = userDto.email;
    user.password = userDto.password;
    user.role = userDto.role;
    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id);
    await this.userRepository.remove(user);
  }

  async validateEmailExistence(email: string, toUpdateId?: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email, id: toUpdateId ? Not(toUpdateId) : undefined },
    });
    if (existingUser) {
      throw new BadRequestException(HttpExceptionMessage.USER_ALREADY_EXISTS);
    }
  }
}
