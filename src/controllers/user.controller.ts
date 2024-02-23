// Uncomment these imports to begin using these cool features!

import {post, requestBody} from '@loopback/rest';
import httpStatus from 'http-status-codes';
import {generateToken} from '../authentication/authentication';
import {USER_ENDPOINTS, USER_RESPOSE_MESSAGES} from '../constants';
import {CreateNewUserPayload, LoginPayload} from '../dtos/users.dto';
import {createNewUser, fetchUserByEmail} from '../services/users.service';
import {createResponseObject} from '../utils/common.service';
import {verifyPassword} from '../utils/encryption';
// import {inject} from '@loopback/core';

export class UserController {
  constructor() {}

  @post(USER_ENDPOINTS.CREATE_USER)
  async createUser(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string',
                description: 'required Field',
                example: 'alpha',
              },
              lastName: {
                type: 'string',
                description: 'required Field',
                example: 'beeta',
              },
              email: {
                type: 'string',
                description: 'required Field',
                example: 'alpha@gmail.com',
              },
              password: {
                type: 'string',
                description: 'required Field',
                example: 'password',
              },
            },
          },
        },
      },
    })
    createNewUserPayload: CreateNewUserPayload,
  ) {
    return await createNewUser(createNewUserPayload);
  }

  @post(USER_ENDPOINTS.LOGIN_USER)
  async loginUser(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                description: 'required field',
                example: 1,
              },
              firstName: {
                type: 'string',
                description: 'required Field',
                example: 'alpha',
              },
              lastName: {
                type: 'string',
                description: 'required Field',
                example: 'beeta',
              },
              email: {
                type: 'string',
                description: 'required Field',
                example: 'alpha@gmail.com',
              },
            },
          },
        },
      },
    })
    loginPayload: LoginPayload,
  ) {
    // fech user by id
    const response = await fetchUserByEmail(loginPayload.email);
    console.log(`response`);
    console.log(response);

    // user user is returened user hashed password for verification of token
    const verified = await verifyPassword(
      loginPayload.password,
      response?.data?.password,
    );
    // generate token and return
    if (verified) {
      const token = await generateToken(loginPayload);
      return await createResponseObject('', httpStatus.OK, false, '', {
        token: token,
      });
    }
    return await createResponseObject(
      USER_RESPOSE_MESSAGES.UNAUTHORISED_USER,
      httpStatus.FORBIDDEN,
      true,
      '',
      null,
    );
  }
}
