import { IsString, Length, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../enums';

export class UserDto {
  id: string;
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 20)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
