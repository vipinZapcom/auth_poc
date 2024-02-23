// import {bcrypt} from 'bcrypt';
const bcrypt = require('bcrypt');
import {SALT} from '../constants';

export function createHashedPassword(password: string): string {
  const salt = bcrypt.genSaltSync(SALT);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export async function verifyPassword(
  currentPassword: string,
  hasdPasswordFromDB: string,
) {
  const match = await bcrypt.compare(currentPassword, hasdPasswordFromDB);

  if (match) {
    return true;
  }
  return false;
}
