import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ClassSerializerInterceptor,
  UseInterceptors,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { jwtAuthGuard } from '../guards';
import { UserService } from '../services/manageUser.service';
import { UserRole } from '../enums';
import { UserAccessGuard } from '../guards/user-acces.guard';

// TODO: ADD USER ACCESS GUARD ()
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
@Controller('users')
@UseGuards(jwtAuthGuard, UserAccessGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ManageUserController {
  constructor(private readonly userService: UserService) {
    // this.createOne({
    //   email: 'rahma123@gmail.com',
    //   password: 'Test@789',
    //   name: 'Rahma',
    //   role: UserRole.ADMIN,
    // });
  }

  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  @Roles(UserRole.SUPER_USER, UserRole.ADMIN)
  getUserById(@Param('id', ParseIntPipe) id: string) {
    return this.userService.getUserById(id);
  }

  @Post()
  @Roles(UserRole.SUPER_USER, UserRole.ADMIN)
  createOne(@Body() userDto: UserDto) {
    return this.userService.createUser(userDto);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_USER, UserRole.ADMIN)
  updateOne(@Param('id', ParseIntPipe) id: string, @Body() userDto: UserDto) {
    return this.userService.updateUser(id, userDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_USER, UserRole.ADMIN)
  deleteOne(@Param('id', ParseIntPipe) id: string) {
    return this.userService.deleteUser(id);
  }
}
