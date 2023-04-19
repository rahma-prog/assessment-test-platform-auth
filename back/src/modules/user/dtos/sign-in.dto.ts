import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { VALID_PASSWORD_REGEX } from 'src/shared/constants';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(VALID_PASSWORD_REGEX)
  password: string;
}
