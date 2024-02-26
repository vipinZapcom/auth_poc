import {
  Interceptor,
  InvocationContext,
  Next,
  Provider,
  ValueOrPromise,
} from '@loopback/context';
import httpStatus from 'http-status-codes';
import {verifyToken} from '../authentication/authentication';
import {createResponseObject} from '../utils/common.service';

export class UserInterceptor implements Provider<Interceptor> {
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

    const user = await this.validateUser(token);

    return await next();
  };
}
/* async validateUser(
    context: InvocationContext | any,
    next: Next,
  ): Promise<any> {
    const token = context.parent.request.headers['authorization'].split(' ')[1];
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
    return await next();
  }
} */
