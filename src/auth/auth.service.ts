import { HttpException, Injectable } from '@nestjs/common';
import { SignInAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/registrer-auth.dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

let dataBase = [];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(userObject: RegisterAuthDto) {
    const { password } = userObject;

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    userObject = { ...userObject, password: hash };
    dataBase.push(userObject);
    return `User ${userObject.name} has successfully registered`;
  }

  async signIn(userObjectLogin: SignInAuthDto) {
    const { email: emailToLogin, password: plainPassword } = userObjectLogin;

    const findtoUsertoDB: RegisterAuthDto = await dataBase.find(
      (element) => (element.email = emailToLogin),
    );

    if (!findtoUsertoDB.email) throw new HttpException('USER_NOT_FOUND', 404);

    const isMatch = await bcrypt.compare(
      plainPassword,
      findtoUsertoDB.password,
    );

    if (!isMatch) throw new HttpException('PASSWORD_INCORRECT', 403);

    const payLoad = { id: findtoUsertoDB._id, name: findtoUsertoDB.name };
    const token = await this.jwtService.sign(payLoad);

    const dataUser = {
      user: findtoUsertoDB,
      token,
    };

    return dataUser;
  }
}
