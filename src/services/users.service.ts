import * as _ from 'lodash';
import {CreateNewUserPayload, UserExistsPayload} from '../dtos/users.dto';
import {
  checkIfTheUserExistsDb,
  countAllUsersDb,
  createNewUserObjectDb,
  fetchUserByEmailDB,
  fetchUserByIdDb,
  saveNewUserDb,
} from '../repositories/users.repository';
import {createHashedPassword} from '../utils/encryption';

/**
 * Creates a new user.
 */
export async function createNewUser(
  createNewUserPayload: CreateNewUserPayload,
) {
  try {
    const password = createNewUserPayload.password;
    const userExistPayload: UserExistsPayload = _.omit(
      createNewUserPayload,
      'password',
    );

    const isUserExists = await checkIfTheUserExistsDb(userExistPayload);
    if (isUserExists && isUserExists._id) {
      return {
        data: [],
        error: `The given user already exists.`,
        isError: false,
        statusCode: 200,
      };
    }
    const hasdPassword = createHashedPassword(password);
    const usersCount = await countAllUsersDb();
    createNewUserPayload.password = hasdPassword;
    const newUser = await createNewUserObjectDb(
      createNewUserPayload,
      usersCount + 1,
    );
    const createdUserResponseDb = await saveNewUserDb(newUser);
    if (createdUserResponseDb) {
      return {
        data: createdUserResponseDb,
        statusCode: 201,
        isError: false,
        error: '',
      };
    }
  } catch (error) {
    console.log('Failed creating the user');
    return {
      data: [],
      statusCode: 500,
      error: error,
      isError: true,
    };
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
 * Fetches a user by its emai from the database.
 */
export async function fetchUserByEmail(email: string): Promise<{
  error: string | null;
  isError: boolean;
  data: any;
  statusCode: number;
}> {
  try {
    const user = await fetchUserByEmailDB(email);
    return {
      error: user ? null : `user having id ${email} doesn't exists`,
      isError: false,
      data: user ? user : [],
      statusCode: user ? 200 : 404,
    };
  } catch (error) {
    console.error('Failed fetching the users', error);
    return {
      error: 'Failed fetching the users',
      statusCode: 500,
      isError: true,
      data: [],
    };
  }
}

/**
 * Fetches a user by its ID from the database.
 */
export async function fetchUserById(id: number): Promise<{
  error: string | null;
  isError: boolean;
  data: any;
  statusCode: number;
}> {
  try {
    const userHavingTheGivenId = await fetchUserByIdDb(id);
    return {
      error: userHavingTheGivenId
        ? null
        : `user having id ${id} doesn't exists`,
      isError: false,
      data: userHavingTheGivenId ? userHavingTheGivenId : [],
      statusCode: userHavingTheGivenId ? 200 : 404,
    };
  } catch (error) {
    console.error('Failed fetching the users', error);
    return {
      error: 'Failed fetching the users',
      statusCode: 500,
      isError: true,
      data: [],
    };
  }
}

// /**
//  * Fetches all users from the database.
//  */
// export async function fetchAllUsers(): Promise<{
//   data: (User | undefined)[];
//   statusCode: number;
//   isError: boolean;
//   error: string;
// }> {
//   try {
//     console.log('Fetching the users from mongoDB');
//     const allUsers = await fetchAllUsersDb();
//     if (allUsers.length === 0) {
//       console.log('No users found...Returning');
//       return await createResponseObject(
//         null,
//         httpStatus.NOT_FOUND,
//         false,
//         USER_SUCCESS_RESPONSE_MESSAGES.noUsersFound,
//         [],
//       );
//     }
//     return await createResponseObject(
//       null,
//       httpStatus.OK,
//       false,
//       USER_SUCCESS_RESPONSE_MESSAGES.usersFetchedSuccessfully,
//       allUsers,
//     );
//   } catch (error) {
//     console.error('Failed fetching the users', error);
//     return {
//       error: 'Failed fetching the users',
//       statusCode: 500,
//       isError: true,
//       data: [],
//     };
//   }
// }

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
