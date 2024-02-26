import {JSON_SECRET_KEY} from '../constants';
import {User, generateTokenUserPayload} from '../dtos/users.dto';
const jwt = require('jsonwebtoken');

export async function generateToken(
  userProfile: generateTokenUserPayload,
): Promise<string> {
  const {firstName, lastName, email, role} = userProfile;

  const userObjForToken = {firstName, lastName, email, role};

  const token = jwt.sign(userObjForToken, JSON_SECRET_KEY, {
    expiresIn: '1h', // Set the expiration time as needed
  });
  return token;
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const user = jwt.verify(token, JSON_SECRET_KEY);
    return user;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}
