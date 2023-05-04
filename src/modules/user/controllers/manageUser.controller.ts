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
} from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { UserService } from '../services/manageUser.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class ManageUserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create-user')
  createOne(@Body() userDto: UserDto) {
    return this.userService.createUser(userDto);
  }

  @Get()
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  updateOne(@Param('id') id: string, @Body() userDto: UserDto) {
    return this.userService.updateUser(id, userDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
