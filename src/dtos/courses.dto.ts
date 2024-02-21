import Joi from 'joi';
import * as _ from 'lodash';
export type Course = {
  id: number;
  description: string;
  title: string;
};

export type CreateNewCoursePayload = _.Omit<Course, 'id'>;

export type PutCoursePayload = Course;

export type PatchCoursePayload = Partial<Pick<Course, 'title' | 'description'>>;

/* The line `const courseIdSchema = Joi.number().integer().positive().min(1);` is
defining a schema using the Joi library for validating a course ID. */
const courseIdSchema = Joi.number().integer().positive().min(1);

/* The code `const titleSchema = Joi.string().trim().max(1000);` and `const
descriptionSchema = Joi.string().trim().max(1000);` are defining schemas using the Joi
library for validating the `title` and `description` fields of a course. */
const titleSchema = Joi.string().trim().max(1000);
const descriptionSchema = Joi.string().trim().max(1000);

/* The code `export const getCourseByIdSchema = Joi.object({ ... })` is defining a
schema using the Joi library for validating the request parameters when
retrieving a course by its ID. */
export const getCourseByIdSchema = Joi.object({
  courseId: courseIdSchema.required().messages({
    'number.base': 'courseId passed in URL must be a number',
    'number.min':
      'courseId passed in URL should be a number greater than or equal to 1',
  }),
});

/* The code `export const createCoursesSchema = Joi.object({ ... })` is defining a
schema using the Joi library for validating the request description when creating a new
course. */
export const createCoursesSchema = Joi.object({
  title: titleSchema.required(),
  description: descriptionSchema.required(),
});

/* The `patchCoursesSchema` is defining a schema using the Joi library for validating
the request description when updating a course. */
export const patchCoursesSchema = Joi.object({
  title: titleSchema,
  description: descriptionSchema,
  courseId: courseIdSchema.required().messages({
    'number.base': 'id passed in URL must be a number',
    'number.min':
      'id passed in URL should be a number greater than or equal to 1',
  }),
})
  .or('title', 'description')
  .messages({
    'object.missing': 'either title or description is required',
  });

/* The `putCoursesSchema` is defining a schema using the Joi library for validating
the request description when updating a course. It specifies the following fields: */
export const putCoursesSchema = Joi.object({
  title: titleSchema.required(),
  description: descriptionSchema.required(),
  id: courseIdSchema.required(),
  courseId: Joi.number().min(1).required().valid(Joi.ref('id')).messages({
    'number.base': 'id passed in URL must be a number',
    'number.min':
      'id passed in URL should be a number greater than or equal to 1',
    'any.only':
      'id passed in URL must be equal to the id passed in the request description',
  }),
});

/* The line `export const deleteCourseByIdSchema = getCourseByIdSchema;` is exporting a
constant named `deleteCourseByIdSchema` that is assigned the value of
`getCourseByIdSchema`. This means that `deleteCourseByIdSchema` will have the same
schema definition as `getCourseByIdSchema`, which is a schema for validating the
request parameters when deleting a course by its ID. */
export const deleteCourseByIdSchema = getCourseByIdSchema;
