import {
  Interceptor,
  InvocationContext,
  Next,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {
  createCoursesSchema,
  deleteCourseByIdSchema,
  getCourseByIdSchema,
  patchCoursesSchema,
  putCoursesSchema,
} from '../dtos/courses.dto';
import {validateRequestBody} from '../utils/joi.service';
// This is the main interceptor that will have sub interceptors which will do the validation logics when we will receive the request
export class LoggingInterceptor implements Provider<Interceptor> {
  value(): ValueOrPromise<Interceptor> {
    throw new Error('Method not implemented.');
  }
  /**
   * Interceptor to validate and fetch course by ID.
   */
  async fetchCourseByIdInterceptor(
    context: InvocationContext,
    next: Next,
  ): Promise<any> {
    const courseIdFromUrl = context.args[0];
    const finalRequestBody = {courseId: courseIdFromUrl};
    const validationResponse = await validateRequestBody(
      finalRequestBody,
      getCourseByIdSchema,
    );
    if (validationResponse?.error.length) {
      return validationResponse;
    }
    const result = await next();
    return result;
  }

  /**
   * Interceptor to validate and create a new course.
   */
  async createCourseInterceptor(
    context: InvocationContext,
    next: Next,
  ): Promise<any> {
    const requestBody = context.args[0];
    const validationResponse = await validateRequestBody(
      requestBody,
      createCoursesSchema,
    );
    if (validationResponse?.error.length) {
      return validationResponse;
    }
    const result = await next();
    return result;
  }
  /**
   * Interceptor to validate and update an existing course partially.
   */
  async patchCourseInterceptor(
    context: InvocationContext,
    next: Next,
  ): Promise<any> {
    const requestBody = context.args[0];
    const courseId = context.args[1];
    const finalRequestBody = {courseId, ...requestBody};
    const validationResponse = await validateRequestBody(
      finalRequestBody,
      patchCoursesSchema,
    );
    if (validationResponse?.error.length) {
      return validationResponse;
    }
    const result = await next();
    return result;
  }

  /**
   * Interceptor to validate and replace an existing course entirely.
   */
  async putCourseInterceptor(
    context: InvocationContext,
    next: Next,
  ): Promise<any> {
    const requestBody = context.args[0];
    const courseId = context.args[1];
    const finalRequestBody = {courseId, ...requestBody};
    const validationResponse = await validateRequestBody(
      finalRequestBody,
      putCoursesSchema,
    );
    if (validationResponse?.error.length) {
      return validationResponse;
    }
    const result = await next();
    return result;
  }
  /**
   * Interceptor to validate and delete a course by ID.
   */
  async deleteCourseInterceptor(
    context: InvocationContext,
    next: Next,
  ): Promise<any> {
    const courseId = context.args[0];
    const validationResponse = await validateRequestBody(
      {courseId},
      deleteCourseByIdSchema,
    );
    if (validationResponse?.error.length) {
      return validationResponse;
    }
    const result = await next();
    return result;
  }
}
