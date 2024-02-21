import {Request} from '@loopback/rest';
import httpStatus from 'http-status-codes';
import {DeleteResult} from 'mongodb';
import {COURSE_SUCCESS_RESPONSE_MESSAGES} from '../constants';
import {
  Course,
  CreateNewCoursePayload,
  PatchCoursePayload,
  PutCoursePayload,
} from '../dtos/courses.dto';
import {
  checkIfTheCourseExistsDb,
  countAllCoursesDb,
  createNewCourseObjectDb,
  deleteCourseByIdDb,
  fetchAllCoursesDb,
  fetchCourseByIdDb,
  findCourseByIdAndUpdateDb,
  saveNewCourseDb,
} from '../repositories/courses.repository';
import {createResponseObject} from '../utils/common.service';

/**
 * Fetches all courses from the database.
 */
export async function fetchAllCourses(): Promise<{
  data: (Course | undefined)[];
  statusCode: number;
  isError: boolean;
  error: string;
}> {
  try {
    console.log('Fetching the courses from mongoDB');
    const allCourses = await fetchAllCoursesDb();
    if (allCourses.length === 0) {
      console.log('No courses found...Returning');
      return await createResponseObject(
        null,
        httpStatus.NOT_FOUND,
        false,
        COURSE_SUCCESS_RESPONSE_MESSAGES.noCoursesFound,
        [],
      );
    }
    return await createResponseObject(
      null,
      httpStatus.OK,
      false,
      COURSE_SUCCESS_RESPONSE_MESSAGES.coursesFetchedSuccessfully,
      allCourses,
    );
  } catch (error) {
    console.error('Failed fetching the courses', error);
    return {
      error: 'Failed fetching the courses',
      statusCode: 500,
      isError: true,
      data: [],
    };
  }
}

/**
 * Fetches a course by its ID from the database.
 */
export async function fetchCourseById(id: number): Promise<{
  error: string | null;
  isError: boolean;
  data: any;
  statusCode: number;
}> {
  try {
    const courseHavingTheGivenId = await fetchCourseByIdDb(id);
    return {
      error: courseHavingTheGivenId
        ? null
        : `course having id ${id} doesn't exists`,
      isError: false,
      data: courseHavingTheGivenId ? courseHavingTheGivenId : [],
      statusCode: courseHavingTheGivenId ? 200 : 404,
    };
  } catch (error) {
    console.error('Failed fetching the courses', error);
    return {
      error: 'Failed fetching the courses',
      statusCode: 500,
      isError: true,
      data: [],
    };
  }
}

/**
 * Creates a new course.
 */
export async function makeNewCourse(
  createNewCoursePayload: CreateNewCoursePayload,
) {
  try {
    const coursesCount = await countAllCoursesDb();
    const newCourse = await createNewCourseObjectDb(
      createNewCoursePayload,
      coursesCount + 1,
    );
    const isCourseExists = await checkIfTheCourseExistsDb(
      createNewCoursePayload,
    );
    if (isCourseExists && isCourseExists._id) {
      return {
        data: [],
        error: `The given course already exists.`,
        isError: false,
        statusCode: 200,
      };
    }
    const createdCourseResponseDb = await saveNewCourseDb(newCourse);
    if (createdCourseResponseDb) {
      return {
        data: createdCourseResponseDb,
        statusCode: 201,
        isError: false,
        error: '',
      };
    }
  } catch (error) {
    console.log('Failed creating the course');
    return {
      data: [],
      statusCode: 500,
      error: error,
      isError: true,
    };
  }
}

/**
 * Modifies a course using PATCH method.
 */
export async function modifyCourseViaPatch(
  courseId: number,
  patchCoursePayload: PatchCoursePayload | PutCoursePayload,
) {
  try {
    const givenCourseDb = await fetchCourseByIdDb(courseId);
    if (!givenCourseDb) {
      return {
        isError: false,
        data: [],
        error: `The given course doesn't exists in the database`,
        statusCode: 404,
      };
    }
    const updateGivenCourseResponse = await findCourseByIdAndUpdateDb(
      courseId,
      patchCoursePayload,
    );
    if (updateGivenCourseResponse) {
      return {
        data: await fetchCourseByIdDb(courseId),
        isError: false,
        statusCode: 200,
        error: null,
      };
    }
  } catch (error) {
    console.log('Failed editing the course having the id:', courseId);
    return {
      data: [],
      isError: true,
      error: error,
      statusCode: 500,
    };
  }
}

/**
 * Deletes a course by its ID.
 */
export async function deleteCourseById(courseId: number, request: Request) {
  try {
    const deleteCourseResponseDb: DeleteResult =
      await deleteCourseByIdDb(courseId);
    if (deleteCourseResponseDb && deleteCourseResponseDb?.deletedCount !== 0) {
      return {
        data: deleteCourseResponseDb,
        error: null,
        isError: false,
        statusCode: 204,
      };
    }
    return {
      data: [],
      error: `courseId ${courseId} doesn't exists to be deleted`,
      isError: false,
      statusCode: 404,
    };
  } catch (error) {
    console.log('Failed to delete the course', error);
    return {
      data: [],
      isError: true,
      error: error,
      statusCode: 500,
    };
  }
}
