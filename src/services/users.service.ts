import httpStatus from 'http-status-codes';
import * as _ from 'lodash';
import multer from 'multer';
import {promisify} from 'util';
import {USER_RESPOSE_MESSAGES} from '../constants';
import {FileDetails} from '../dtos/file.dto';
import {
  CreateNewUserPayload,
  CreateNewUserPayloadWithUserRole,
  GetUserResponseStructure,
  UserExistsPayload,
} from '../dtos/users.dto';
import {
  checkIfTheUserExistsDb,
  countAllUsersDb,
  createNewUserObjectDb,
  fetchAllUsersDb,
  fetchUserByEmailDB,
  fetchUserByIdDb,
  saveNewUserDb,
} from '../repositories/users.repository';
import {ResponseDTO} from '../utils/common.dtos';
import {createResponseObject} from '../utils/common.service';
import {createHashedPassword} from '../utils/encryption';
import {getSignedUrlForImage, storeNewImage} from './image.service';

const storage = multer.memoryStorage();
const upload = multer({storage: storage});
export const uploadFileAsync = promisify(upload.single('file'));

/**
 * Creates a new user.
 */
export async function createNewUser(
  createNewUserPayload: CreateNewUserPayload,
  fileDetails: FileDetails,
) {
  try {
    let errorMessage = '';
    const imageStoredInDbResponse: ResponseDTO =
      await storeNewImage(fileDetails);
    if (imageStoredInDbResponse.statusCode != 200) {
      console.error(imageStoredInDbResponse.error);

      errorMessage = imageStoredInDbResponse.error;
    } else {
      console.log('Image uploaded successfully.');
    }

    const password = createNewUserPayload.password;
    const userExistPayload: UserExistsPayload = _.omit(
      createNewUserPayload,
      'password',
    );

    const isUserExists = await checkIfTheUserExistsDb(userExistPayload);
    if (isUserExists && isUserExists._id) {
      return createResponseObject(
        ``,
        200,
        false,
        `The given user already exists.`,
        null,
      );
    }
    const hashedPassword = createHashedPassword(password);
    const usersCount = await countAllUsersDb();
    // createNewUserPayload.password = hashedPassword;
    const {firstName, lastName, email} = createNewUserPayload;
    const createNewUserPayloadWithUserRole: CreateNewUserPayloadWithUserRole = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      imageName: errorMessage.length
        ? ''
        : imageStoredInDbResponse?.data?.imageName,
      role: 'readOnly',
    };
    // createNewUserPayloadWithUserRole.role = 'readOnly';
    const newUser = await createNewUserObjectDb(
      createNewUserPayloadWithUserRole,
      usersCount + 1,
    );
    const createdUserResponseDb = await saveNewUserDb(newUser);
    if (createdUserResponseDb) {
      const {id, role} = createdUserResponseDb;
      const returnObj = {id, role};
      return createResponseObject(errorMessage, 201, false, '', returnObj);
    }
  } catch (error) {
    console.log('Failed creating the user');
    return createResponseObject(error, 500, true, '', null);
  }
}

/*
Check if user exists.
*/

export async function checkIfUserExists(userExistsPayload: UserExistsPayload) {
  try {
    const isUserExists = await checkIfTheUserExistsDb(userExistsPayload);
    if (isUserExists && isUserExists._id) {
      return true;
    }
    return false;
  } catch (error) {
    console.log('Failed to fetch the user.');
    return false;
  }
}

/**
 * Fetches a user by its email from the database.
 */
export async function fetchUserByEmail(email: string): Promise<ResponseDTO> {
  try {
    const user = await fetchUserByEmailDB(email);
    if (user) {
      if (user?.imageName) {
        const {firstName, lastName, email, role, imageName} = user;
        const url = await getSignedUrlForImage(imageName);
        const returnUser = {firstName, lastName, email, role, url};

        return await createResponseObject(
          '',
          200,
          false,
          USER_RESPOSE_MESSAGES.USERS_FETCHED_SUCCESSFULLY,
          returnUser,
        );
      } else {
        return await createResponseObject(
          'Unable to fetch User image',
          200,
          false,
          USER_RESPOSE_MESSAGES.USERS_FETCHED_SUCCESSFULLY,
          user,
        );
      }
    }
    return await createResponseObject(
      `${USER_RESPOSE_MESSAGES.FAILED_FETCHING_USERS} with email id ${email}.`,
      404,
      true,
      '',
      null,
    );
  } catch (error) {
    console.error(USER_RESPOSE_MESSAGES.FAILED_FETCHING_USERS, error);
    return await createResponseObject(
      error.message,
      httpStatus.BAD_GATEWAY,
      true,
      '',
      null,
    );
  }
}

/**
 * Fetches a user by its ID from the database.
 */
export async function fetchUserById(id: number): Promise<ResponseDTO> {
  try {
    const user = await fetchUserByIdDb(id);
    console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW');
    console.log(user);

    console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW');

    if (user) {
      if (user?.imageName) {
        // const user;
        const {firstName, lastName, email, role, imageName} = user;
        const url = await getSignedUrlForImage(imageName);
        const returnUser = {firstName, lastName, email, role, url};

        return await createResponseObject(
          '',
          200,
          false,
          USER_RESPOSE_MESSAGES.USERS_FETCHED_SUCCESSFULLY,
          returnUser,
        );
      } else {
        return await createResponseObject(
          'Unable to fetch User image',
          200,
          false,
          USER_RESPOSE_MESSAGES.USERS_FETCHED_SUCCESSFULLY,
          user,
        );
      }
    }
    return await createResponseObject(
      `${USER_RESPOSE_MESSAGES.FAILED_FETCHING_USERS} with id ${id}.`,
      404,
      true,
      '',
      null,
    );
  } catch (error) {
    console.error(USER_RESPOSE_MESSAGES.FAILED_FETCHING_USERS, error);
    return await createResponseObject(
      error.message,
      httpStatus.BAD_GATEWAY,
      true,
      '',
      null,
    );
  }
}

/**
 * Fetches all users from the database.
 */
export async function fetchAllUsers(): Promise<ResponseDTO> {
  try {
    console.log('Fetching the users from mongoDB');
    const users = await fetchAllUsersDb();
    if (users.length === 0) {
      console.log(USER_RESPOSE_MESSAGES.USER_NOT_FOUND);
      return await createResponseObject(
        USER_RESPOSE_MESSAGES.USER_NOT_FOUND,
        httpStatus.NOT_FOUND,
        false,
        '',
        null,
      );
    }
    let allUsers: GetUserResponseStructure[] = [];
    let errorMessages: string[] = [];
    for (const user of users) {
      if (user?.imageName) {
        const {firstName, lastName, email, role, imageName} = user;
        const url = await getSignedUrlForImage(imageName);
        const userWithUrl = {firstName, lastName, email, role, url};
        allUsers.push(userWithUrl);
      } else {
        const id = user.id;
        errorMessages.push(
          `${USER_RESPOSE_MESSAGES.FAILED_FETCHING_USERS_IMAGE} id`,
        );
      }
    }

    return await createResponseObject(
      errorMessages,
      httpStatus.OK,
      false,
      USER_RESPOSE_MESSAGES.USERS_FETCHED_SUCCESSFULLY,
      allUsers,
    );
  } catch (error) {
    console.error(USER_RESPOSE_MESSAGES.FAILED_FETCHING_USERS, error);
    return await createResponseObject(
      error.message,
      httpStatus.BAD_GATEWAY,
      true,
      '',
      null,
    );
  }
}

// /**
//  * Modifies a user using PATCH method.
//  */
// export async function modifyUserViaPatch(
//   userId: number,
//   patchUserPayload: PatchUserPayload | PutUserPayload,
// ) {
//   try {
//     const givenUserDb = await fetchUserByIdDb(userId);
//     if (!givenUserDb) {
//       return {
//         isError: false,
//         data: [],
//         error: `The given user doesn't exists in the database`,
//         statusCode: 404,
//       };
//     }
//     const updateGivenUserResponse = await findUserByIdAndUpdateDb(
//       userId,
//       patchUserPayload,
//     );
//     if (updateGivenUserResponse) {
//       return {
//         data: await fetchUserByIdDb(userId),
//         isError: false,
//         statusCode: 200,
//         error: null,
//       };
//     }
//   } catch (error) {
//     console.log('Failed editing the user having the id:', userId);
//     return {
//       data: [],
//       isError: true,
//       error: error,
//       statusCode: 500,
//     };
//   }
// }

// /**
//  * Deletes a user by its ID.
//  */
// export async function deleteUserById(userId: number, request: Request) {
//   try {
//     const deleteUserResponseDb: DeleteResult = await deleteUserByIdDb(userId);
//     if (deleteUserResponseDb && deleteUserResponseDb?.deletedCount !== 0) {
//       return {
//         data: deleteUserResponseDb,
//         error: null,
//         isError: false,
//         statusCode: 204,
//       };
//     }
//     return {
//       data: [],
//       error: `userId ${userId} doesn't exists to be deleted`,
//       isError: false,
//       statusCode: 404,
//     };
//   } catch (error) {
//     console.log('Failed to delete the user', error);
//     return {
//       data: [],
//       isError: true,
//       error: error,
//       statusCode: 500,
//     };
//   }
// }
