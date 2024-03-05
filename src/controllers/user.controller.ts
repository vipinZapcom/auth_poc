// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {
  Request,
  Response,
  RestBindings,
  post,
  requestBody,
} from '@loopback/rest';
import httpStatus from 'http-status-codes';
import {generateToken} from '../authentication/authentication';
import {USER_ENDPOINTS, USER_RESPOSE_MESSAGES} from '../constants';
import {FileDetails} from '../dtos/file.dto';
import {CreateNewUserPayload, LoginPayload} from '../dtos/users.dto';
import {
  createNewUser,
  fetchUserByEmail,
  uploadFileAsync,
} from '../services/users.service';
import {createResponseObject} from '../utils/common.service';
import {verifyPassword} from '../utils/encryption';
// import {inject} from '@loopback/core';

export class UserController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
  ) {}

  @post(USER_ENDPOINTS.CREATE_USER)
  async createUser() {
    await uploadFileAsync(this.req, this.res);
    if (!this.req.file) {
      throw new Error('No file uploaded');
    }
    const {firstName, lastName, password, email} = this.req.body;
    const createNewUserPayload: CreateNewUserPayload = {
      firstName,
      lastName,
      password,
      email,
    };
    const {originalname, encoding, mimetype, buffer} = this.req.file;
    const fileDetails: FileDetails = {
      originalname,
      encoding,
      mimetype,
      buffer,
    };

    return await createNewUser(createNewUserPayload, fileDetails);
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
    // user user is returened user hashed password for verification of token
    const verified = await verifyPassword(
      loginPayload.password,
      response?.data?.password,
    );
    // generate token and return
    if (verified) {
      const token = await generateToken(response?.data);
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
