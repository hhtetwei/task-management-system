import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class PasswordService {
  async hash(plainText: string) {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS ?? '10'));
    const hashed = await bcrypt.hash(plainText, salt);

    return { salt, hashed };
  }

  async verify(plainText: string, hash: string) {
    return await bcrypt.compare(plainText, hash);
  }
}
