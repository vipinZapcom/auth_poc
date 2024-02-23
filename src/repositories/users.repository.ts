import {Document, Types} from 'mongoose';
import {CreateNewUserPayload, UserExistsPayload} from '../dtos/users.dto';
import {Users} from '../models/users.model';

/**
 * Fetches all users from the database.
 */
// export async function fetchAllUsersDb(): Promise<
//   (Document<
//     unknown,
//     {},
//     {
//       id: number;
//       title: string;
//       description: string;
//     }
//   > & {
//     id: number;
//     title: string;
//     description: string;
//   } & {
//     _id: Types.ObjectId;
//   })[]
// > {
//   try {
//     return await Users.find();
//   } catch (error) {
//     throw error;
//   }
// }

/**
 * Fetches a user by its ID from the database.
 */
export async function fetchUserByIdDb(id: number): Promise<Document<
  unknown,
  {},
  {
    id: number;
    title: string;
    description: string;
  } & {
    _id: Types.ObjectId;
  }
> | null> {
  try {
    return await Users.findOne({id});
  } catch (error) {
    throw error;
  }
}

/**
 * Fetches a user by its ID from the database.
 */
export async function fetchUserByEmailDB(email: string): Promise<Document<
  unknown,
  {},
  {
    id: number;
    title: string;
    description: string;
  } & {
    _id: Types.ObjectId;
  }
> | null> {
  try {
    return await Users.findOne({email});
  } catch (error) {
    throw error;
  }
}

/**
 * Counts all users in the database.
 */
export async function countAllUsersDb(): Promise<number> {
  try {
    return await Users.countDocuments();
  } catch (error) {
    throw error;
  }
}

/**
 * Creates a new user object.
 */
export async function createNewUserObjectDb(
  createNewUserPayload: CreateNewUserPayload,
  id: number,
) {
  try {
    return new Users({id, ...createNewUserPayload});
  } catch (error) {
    throw error;
  }
}

/**
 * Checks if a user with the given payload exists in the database.
 */
export async function checkIfTheUserExistsDb(
  createNewUserPayload: UserExistsPayload,
): Promise<{
  _id: Types.ObjectId;
} | null> {
  try {
    return await Users.exists(createNewUserPayload);
  } catch (error) {
    throw error;
  }
}

/**
 * Saves a new user object to the database.
 */
export async function saveNewUserDb(
  userObject: Document<
    unknown,
    {},
    {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    }
  > & {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  } & {
    _id: Types.ObjectId;
  },
): Promise<
  Document<
    unknown,
    {},
    {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    }
  > & {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  } & {
    _id: Types.ObjectId;
  }
> {
  try {
    return await userObject.save();
  } catch (error) {
    throw error;
  }
}

/**
 * Finds a user by its ID and updates it in the database.
 */
// export async function findUserByIdAndUpdateDb(
//   userId: number,
//   patchUserPayload: PatchUserPayload,
// ): Promise<UpdateResult> {
//   try {
//     return (await Users.findOneAndUpdate(
//       {id: userId},
//       patchUserPayload,
//     )) as UpdateResult;
//   } catch (error) {
//     throw error;
//   }
// }

/**
 * Deletes a user by its ID from the database.
 */
// export async function deleteUserByIdDb(userId: number): Promise<DeleteResult> {
//   try {
//     return await Users.deleteOne({id: Number(userId)});
//   } catch (error) {
//     throw error;
//   }
// }
