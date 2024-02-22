import {JSON_SECRET_KEY} from '../constants';
import {LoginPayload} from '../dtos/users.dto';
const jwt = require('jsonwebtoken');

// export class UserAuthentication {
export async function generateToken(
  userProfile: LoginPayload,
): Promise<string> {
  const token = jwt.sign(userProfile, JSON_SECRET_KEY, {
    expiresIn: '1h', // Set the expiration time as needed
  });
  return token;
}
// }
