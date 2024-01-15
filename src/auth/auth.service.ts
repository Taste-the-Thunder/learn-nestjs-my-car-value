// auth.service.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { randomBytes ,scrypt as _scrypt, scrypt } from 'crypto';
import { promisify } from 'util';
import { Script } from 'vm';

@Injectable()
export class AuthService {
  constructor(
    private emailService: MailService, 
    private usersService: UsersService) {}

  async signup(email: string, password: string){
    // see if email is in use
    const users = this.usersService.find(email);
    if(users){
      throw new BadRequestException('email in use');
    }

    //Hash ther users password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Has the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //join the hashed result and the salt togather
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.usersService.create(email, result);

    // return the user
    return user;
  }
  
  async signUp1(user: User) {
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    // create user in db
    // ...
    // send welcome mail
    await this.emailService.sendUserWelcome(user, token);
  }
}
