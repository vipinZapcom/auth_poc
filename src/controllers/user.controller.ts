// Uncomment these imports to begin using these cool features!

import {post, requestBody} from '@loopback/rest';
import {USER_ENDPOINTS} from '../constants';
import {CreateNewUserPayload} from '../dtos/users.dto';
import {createNewUser} from '../services/users.service';

// import {inject} from '@loopback/core';

export class UserController {
  constructor() {}

  @post(USER_ENDPOINTS.CREATE_NEW_USER.PATH)
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
}
