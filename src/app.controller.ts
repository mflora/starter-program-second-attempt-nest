import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';

import { HelloResponse } from './models/HelloResponse';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  private users: Array<LoginBodyDto> = [];

  constructor(private readonly appService: AppService, private authService: AuthService) {

  }

  @Get('hello')
  getHello(): HelloResponse {
    return { message: this.appService.getHello() };
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('userInfo')
  getUserinfo(@Request() req) {
    const token = req.get('Authorization');
    if (!token) {
      return HttpStatus.UNAUTHORIZED;
    }
    return this.authService.getUserInfo(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    const token = req.get('Authorization');
    if (!token) {
      return HttpStatus.UNAUTHORIZED;
    }
    return req.user;
  }

  @Post('register')
  register(@Body() body: LoginBodyDto) {
    return this.authService.register(body.username, body.password);
  }

  @Delete('deleteUser/')
  async deleteUser(@Request() req): Promise<HttpStatus> {

    const token = req.get('Authorization');
    if (!token) {
      return HttpStatus.UNAUTHORIZED;
    }
    return await this.authService.deleteUser(token);
  }

  @Put('changePassword')
  async changePassword(@Request() req): Promise<HttpStatus> {
    const token = req.get('Authorization');
    if (!token) {
      return HttpStatus.UNAUTHORIZED;
    }
    return await this.authService.changePassword(req.body);
  }
}

interface LoginBodyDto {
  username: string;
  password: string;
}
