import { IsNotEmpty, IsEmail, MaxLength, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @IsNotEmpty()
  _id: string;
  name: string;
  @IsEmail()
  email: string;

  @MinLength(4)
  @MaxLength(12)
  password: string;
}
