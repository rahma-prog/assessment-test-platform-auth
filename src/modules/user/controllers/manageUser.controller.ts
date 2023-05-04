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

// TODO: ADD USER ACCESS GUARD ()
@Controller('users')
@UseGuards(jwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ManageUserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: string) {
    return this.userService.getUserById(id);
  }

  @Post()
  createOne(@Body() userDto: UserDto) {
    return this.userService.createUser(userDto);
  }

  @Put(':id')
  updateOne(@Param('id', ParseIntPipe) id: string, @Body() userDto: UserDto) {
    return this.userService.updateUser(id, userDto);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: string) {
    return this.userService.deleteUser(id);
  }
}
