// import {bcrypt} from 'bcrypt';
const bcrypt = require('bcrypt');
import {SALT} from '../constants';

export function createHashedPassword(password: string): string {
  const salt = bcrypt.genSaltSync(SALT);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export function verifyPassword(
  currentPassword: string,
  hasdPasswordFromDB: string,
) {
  bcrypt.compare(
    currentPassword,
    hasdPasswordFromDB,
    function (err: Error, result: boolean) {
      if (err) {
        console.log(err);
        return false;
      }
      return result;
      // result == true
    },
  );
}
