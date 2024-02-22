import {DeleteResult, UpdateResult} from 'mongodb';
import {Document, Types} from 'mongoose';
import {CreateNewCoursePayload, PatchCoursePayload} from '../dtos/courses.dto';
import {Courses} from '../models/courses.model';

/**
 * Fetches all courses from the database.
 */
export async function fetchAllCoursesDb(): Promise<
  Document<
    unknown,
    {},
    {
      id: number;
      title: string;
      description: string;
    } & {
      _id: Types.ObjectId;
    }
  >[]
> {
  try {
    return await Courses.find();
  } catch (error) {
    throw error;
  }
}

/**
 * Fetches a course by its ID from the database.
 */
export async function fetchCourseByIdDb(id: number): Promise<
  | (Document<
      unknown,
      {},
      {
        id: number;
        title: string;
        description: string;
      }
    > & {
      id: number;
      title: string;
      description: string;
    } & {
      _id: Types.ObjectId;
    })
  | null
> {
  try {
    return await Courses.findOne({id});
  } catch (error) {
    throw error;
  }
}

/**
 * Counts all courses in the database.
 */
export async function countAllCoursesDb(): Promise<number> {
  try {
    return await Courses.countDocuments();
  } catch (error) {
    throw error;
  }
}

/**
 * Creates a new course object.
 */
export async function createNewCourseObjectDb(
  createNewCoursePayload: CreateNewCoursePayload,
  id: number,
) {
  try {
    return new Courses({id, ...createNewCoursePayload});
  } catch (error) {
    throw error;
  }
}

/**
 * Checks if a course with the given payload exists in the database.
 */
export async function checkIfTheCourseExistsDb(
  createNewCoursePayload: CreateNewCoursePayload,
): Promise<{
  _id: Types.ObjectId;
} | null> {
  try {
    return await Courses.exists(createNewCoursePayload);
  } catch (error) {
    throw error;
  }
}

/**
 * Saves a new course object to the database.
 */
export async function saveNewCourseDb(
  courseObject: Document<
    unknown,
    {},
    {
      id: number;
      title: string;
      description: string;
    }
  > & {
    id: number;
    title: string;
    description: string;
  } & {
    _id: Types.ObjectId;
  },
): Promise<
  Document<
    unknown,
    {},
    {
      id: number;
      title: string;
      description: string;
    }
  > & {
    id: number;
    title: string;
    description: string;
  } & {
    _id: Types.ObjectId;
  }
> {
  try {
    return await courseObject.save();
  } catch (error) {
    throw error;
  }
}

/**
 * Finds a course by its ID and updates it in the database.
 */
export async function findCourseByIdAndUpdateDb(
  courseId: number,
  patchCoursePayload: PatchCoursePayload,
): Promise<UpdateResult> {
  try {
    return (await Courses.findOneAndUpdate(
      {id: courseId},
      patchCoursePayload,
    )) as UpdateResult;
  } catch (error) {
    throw error;
  }
}

/**
 * Deletes a course by its ID from the database.
 */
export async function deleteCourseByIdDb(
  courseId: number,
): Promise<DeleteResult> {
  try {
    return await Courses.deleteOne({id: Number(courseId)});
  } catch (error) {
    throw error;
  }
}
