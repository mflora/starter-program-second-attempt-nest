import { HttpStatus, Injectable } from '@nestjs/common';
import { User, UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, password: string): Promise<HttpStatus> {
    const user = await this.usersService.findOne(username);
    if (user) {
      return HttpStatus.BAD_REQUEST;
    }
    this.usersService.addUser({userId: Math.floor(Math.random() * 100), username: username, password: password})
    return HttpStatus.CREATED;
  }

  async getUserInfo(token: string) {

    let decodedToken;
    try {
      const slicedToken = token.slice(7);
      console.log(slicedToken);
      decodedToken = this.jwtService.decode(slicedToken);
      const username = decodedToken.username;
      const user = await this.usersService.findOne(decodedToken.username);
      if (!user) {
        return HttpStatus.BAD_REQUEST;
      }
      console.log("ADSSDASDASDASDASD");
      console.log(user);
      console.log("ADSSDASDASDASDASD");
      return {
        username: user.username,
      }
    } catch (e) {
      return HttpStatus.BAD_REQUEST;
    }
  }

  async deleteUser(token: string) {
    let decodedToken;
    try {
      this.jwtService.verify(token);
    } catch (e) {
      return HttpStatus.UNAUTHORIZED;
    }

    try {
      decodedToken = this.jwtService.decode(token);
      this.usersService.deleteUser(decodedToken.username);
    } catch (e) {
      return HttpStatus.BAD_REQUEST
    }

    return HttpStatus.OK;
  }

  async changePassword(body: profileBodyDto) {
    const username = body.username;
    const user:User = await this.usersService.findOne(username);

    if(!user || user.password !== body.password) {
      return HttpStatus.BAD_REQUEST;
    }

    this.usersService.changePassword(username, body.newPassword);

    return HttpStatus.OK;
  }
}


interface profileBodyDto {
  username: string;
  password: string;
  newPassword: string;
}
