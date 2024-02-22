// Uncomment these imports to begin using these cool features!

import {post, requestBody} from '@loopback/rest';
import httpStatus from 'http-status-codes';
import {generateToken} from '../authentication/authentication';
import {USER_ENDPOINTS} from '../constants';
import {CreateNewUserPayload, LoginPayload} from '../dtos/users.dto';
import {checkIfUserExists, createNewUser} from '../services/users.service';
import {createResponseObject} from '../utils/common.service';
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
    if (await checkIfUserExists(loginPayload)) {
      const token = await generateToken(loginPayload);
      return await createResponseObject(false, httpStatus.OK, false, '', {
        token: token,
      });
    }
  }
}
