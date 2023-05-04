import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from '../dtos/user.dto';
import { UserEntity } from '../entities';
import { HttpExceptionMessage } from 'src/shared/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(userDto: UserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { id: userDto.id },
    });
    if (existingUser) {
      throw new UnauthorizedException(HttpExceptionMessage.USER_ALREADY_EXISTS);
    }

    const user = this.userRepository.create(userDto);
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
}
