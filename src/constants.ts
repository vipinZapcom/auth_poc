export const COMPANY_NAME_HEADER = 'zapcom';

/* The `COURSE_ENDPOINTS` constant is an object that defines various endpoints for
interacting with a server's API. Each endpoint is represented by a key-value
pair, where the key is the name of the endpoint and the value is an object
containing the `PATH` and `METHOD_TYPE` properties. */
export const COURSE_ENDPOINTS = {
  GET_ALL_COURSES: {
    PATH: '/courses',
    METHOD_TYPE: 'GET',
  },
  GET_COURSE_BY_ID: {
    PATH: '/courses/{courseId}',
    METHOD_TYPE: 'GET',
  },
  CREATE_NEW_COURSE: {
    PATH: '/courses',
    METHOD_TYPE: 'POST',
  },
  UPDATE_COURSE_BY_ID: {
    PATH: '/courses/{courseId}',
    METHOD_TYPE: 'PATCH',
  },
  REPLACE_COURSE_BY_ID: {
    PATH: '/courses/{courseId}',
    METHOD_TYPE: 'PUT',
  },
  DELETE_COURSE_BY_ID: {
    PATH: '/courses/{courseId}',
    METHOD_TYPE: 'DELETE',
  },
};

export const COURSE_SUCCESS_RESPONSE_MESSAGES = {
  COURSES_FETCHED_SUCCESSFULLY: 'all courses have been fetched successfully',
  NO_COURSES_FOUND: 'no course exists to be displayed',
};

export const USER_ENDPOINTS = {
  CREATE_NEW_USER: {
    PATH: '/signup',
    METHOD_TYPE: 'POST',
  },
};
