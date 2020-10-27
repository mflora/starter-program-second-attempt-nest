import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
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
      throw new BadRequestException("Username already exist.");
    }
    this.usersService.addUser({userId: Math.floor(Math.random() * 100), username: username, password: password})
    return HttpStatus.CREATED;
  }

  async getUserInfo(token: string) {

    let decodedToken;
    try {
      const slicedToken = token.slice(7);
      decodedToken = this.jwtService.decode(slicedToken);
      const username = decodedToken.username;
      const user = await this.usersService.findOne(decodedToken.username);
      if (!user) {
        throw new BadRequestException("There is no such user");
      }

      return {
        username: user.username,
      }
    } catch (e) {
      throw new BadRequestException("There is no such user");
    }
  }

  async deleteUser(token: string) {
    let decodedToken;
    try {
      this.jwtService.verify(token);
    } catch (e) {
        throw new UnauthorizedException("You have no right to do this");
      }

    try {
      decodedToken = this.jwtService.decode(token);
      this.usersService.deleteUser(decodedToken.username);
    } catch (e) {
      throw new BadRequestException("There is no such user");
    }

    return HttpStatus.OK;
  }

  async changePassword(body: profileBodyDto) {
    const username = body.username;
    const user:User = await this.usersService.findOne(username);

    if(!user || user.password !== body.password) {
      throw new BadRequestException("Invalid password");
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
