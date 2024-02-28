/* export class UserInterceptor implements Provider<Interceptor> {
  value(): ValueOrPromise<Interceptor> {
    throw new Error('This method is not implemented.');
  }

  validateUser = async (token: string): Promise<any> => {
    const verifiedUser = await verifyToken(token);
    if (!verifiedUser) {
      return await createResponseObject(
        'Invalid token',
        httpStatus.UNAUTHORIZED,
        true,
        '',
        null,
      );
    }
    return verifiedUser;
  };

  checkCreateRights = async (context: InvocationContext | any, next: Next) => {
    const token = context.parent.request.headers['authorization'].split(' ')[1];

    const user: generateTokenUserPayload = await this.validateUser(token);
    if (USER_ROLES[user.role] < 1) {
      // return error message
      return await createResponseObject(
        `You don't have rights to access this.`,
        httpStatus.FORBIDDEN,
        true,
        '',
        null,
      );
    }
    return await next();
  };

}
 */

import {Interceptor, InvocationContext, Next} from '@loopback/context';
import httpStatus from 'http-status-codes';
import {verifyToken} from '../authentication/authentication';
import {generateTokenUserPayload} from '../dtos/users.dto';
import {createResponseObject} from '../utils/common.service';

const validateUser = async (token: string): Promise<any> => {
  const verifiedUser = await verifyToken(token);
  if (!verifiedUser) {
    return await createResponseObject(
      'Invalid token',
      httpStatus.UNAUTHORIZED,
      true,
      '',
      null,
    );
  }

  return await createResponseObject(
    '',
    httpStatus.ACCEPTED,
    false,
    'valid token',
    verifiedUser,
  );
  return verifiedUser;
};

export const checkRights = (userRole: string[]): Interceptor => {
  return async (context: InvocationContext | any, next: Next) => {
    console.log('inside checkRights');

    const token =
      context.parent.request.headers['authorization']?.split(' ')[1];
    console.log(`token`);
    console.log(token);

    if (!token) {
      return await createResponseObject(
        `Please provide authentication token.`,
        httpStatus.FORBIDDEN,
        true,
        '',
        null,
      );
    }

    // const user: generateTokenUserPayload = await validateUser(token);
    const data = await validateUser(token);
    if (data.isError) {
      return data;
    }
    // const user1: <generateTokenUserPayload>(user);
    const user: generateTokenUserPayload = data.data;
    console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW');

    console.log(user);
    const userRoleUpperCase: string = user.role.toUpperCase();
    console.log(userRoleUpperCase);
    console.log(userRole);
    // console.log(USER_ROLES[userRoleUpperCase]);
    console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW');

    if (!userRole.includes(user.role)) {
      // return error message
      return await createResponseObject(
        `You don't have rights to access this.`,
        httpStatus.FORBIDDEN,
        true,
        '',
        null,
      );
    }

    return await next();
  };
};
