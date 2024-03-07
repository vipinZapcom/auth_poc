export const COMPANY_NAME_HEADER = 'zapcom';

/* The `COURSE_ENDPOINTS` constant is an object that defines various endpoints for
interacting with a server's API. Each endpoint is represented by a key-value
pair, where the key is the name of the endpoint and the value is an object
containing the `PATH` and `METHOD_TYPE` properties. */
export const COURSE_ENDPOINTS = {
  GET_ALL_COURSES: '/courses',
  GET_COURSE_BY_ID: '/courses/{courseId}',
  CREATE_NEW_COURSE: '/courses',
  UPDATE_COURSE_BY_ID: '/courses/{courseId}',
  REPLACE_COURSE_BY_ID: '/courses/{courseId}',
  DELETE_COURSE_BY_ID: '/courses/{courseId}',
};

export const COURSE_SUCCESS_RESPONSE_MESSAGES = {
  COURSES_FETCHED_SUCCESSFULLY: 'all courses have been fetched successfully',
  NO_COURSES_FOUND: 'no course exists to be displayed',
};

export const USER_ENDPOINTS = {
  CREATE_USER: '/signup',
  LOGIN_USER: '/login',
  GET_USER_BY_ID: '/user/{id}',
  GET_USER_BY_EMAIL: '/user/',
  GET_ALL_USERS: '/users/',
};

export const USER_RESPOSE_MESSAGES = {
  UNAUTHORISED_USER: 'Unable to find this user',
  USER_NOT_FOUND: 'No user has been found with the given details.',
  USERS_FETCHED_SUCCESSFULLY: 'Users are fetched successfully.',
  FAILED_FETCHING_USERS: 'Unable to fetch the given user.',
  FAILED_FETCHING_USERS_IMAGE: 'Unable to fetch the imsge for userId .',
};

export const JSON_SECRET_KEY = 'LEARNING_LOOPBACK';
export const SALT = 10;
