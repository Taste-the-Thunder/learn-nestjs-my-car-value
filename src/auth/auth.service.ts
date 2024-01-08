// auth.service.ts

import { Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(private emailService: MailService) {}

  async signUp(user: User) {
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    // create user in db
    // ...
    // send welcome mail
    await this.emailService.sendUserWelcome(user, token);
  }
}
