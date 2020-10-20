import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private users: User[];

  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'john',
        password: 'changeme',
      },
      {
        userId: 2,
        username: 'chris',
        password: 'secret',
      },
      {
        userId: 3,
        username: 'maria',
        password: 'guess',
      },
    ];
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  deleteUser(username: string) {
    this.users = this.users.filter(function(value, index, arr) {
            return value.username !== username;
    });
  }

  addUser(user: User) {
    this.users.push(user);
  }

  async changePassword(username: string, newPassword: string) {
    const user: User = await this.findOne(username);
    user.password = newPassword;
  }

}
