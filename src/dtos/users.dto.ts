import * as _ from 'lodash';
export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type CreateNewUserPayload = _.Omit<User, 'id'>;
export type UserExistsPayload = _.Omit<CreateNewUserPayload, 'password'>;
export type LoginPayload = _.Omit<User, 'password'>;

// export type PutUserPayload = User;

// export type PatchUserPayload = Partial<Pick<User, 'title' | 'description'>>;

// /* The line `const userIdSchema = Joi.number().integer().positive().min(1);` is
// defining a schema using the Joi library for validating a user ID. */
// const userIdSchema = Joi.number().integer().positive().min(1);

// /* The code `const titleSchema = Joi.string().trim().max(1000);` and `const
// descriptionSchema = Joi.string().trim().max(1000);` are defining schemas using the Joi
// library for validating the `title` and `description` fields of a user. */
// const titleSchema = Joi.string().trim().max(1000);
// const descriptionSchema = Joi.string().trim().max(1000);

// /* The code `export const getUserByIdSchema = Joi.object({ ... })` is defining a
// schema using the Joi library for validating the request parameters when
// retrieving a user by its ID. */
// export const getUserByIdSchema = Joi.object({
//   userId: userIdSchema.required().messages({
//     'number.base': 'userId passed in URL must be a number',
//     'number.min':
//       'userId passed in URL should be a number greater than or equal to 1',
//   }),
// });

// /* The code `export const createUsersSchema = Joi.object({ ... })` is defining a
// schema using the Joi library for validating the request description when creating a new
// user. */
// export const createUsersSchema = Joi.object({
//   title: titleSchema.required(),
//   description: descriptionSchema.required(),
// });

// /* The `patchUsersSchema` is defining a schema using the Joi library for validating
// the request description when updating a user. */
// export const patchUsersSchema = Joi.object({
//   title: titleSchema,
//   description: descriptionSchema,
//   userId: userIdSchema.required().messages({
//     'number.base': 'id passed in URL must be a number',
//     'number.min':
//       'id passed in URL should be a number greater than or equal to 1',
//   }),
// })
//   .or('title', 'description')
//   .messages({
//     'object.missing': 'either title or description is required',
//   });

// /* The `putUsersSchema` is defining a schema using the Joi library for validating
// the request description when updating a user. It specifies the following fields: */
// export const putUsersSchema = Joi.object({
//   title: titleSchema.required(),
//   description: descriptionSchema.required(),
//   id: userIdSchema.required(),
//   userId: Joi.number().min(1).required().valid(Joi.ref('id')).messages({
//     'number.base': 'id passed in URL must be a number',
//     'number.min':
//       'id passed in URL should be a number greater than or equal to 1',
//     'any.only':
//       'id passed in URL must be equal to the id passed in the request description',
//   }),
// });

// /* The line `export const deleteUserByIdSchema = getUserByIdSchema;` is exporting a
// constant named `deleteUserByIdSchema` that is assigned the value of
// `getUserByIdSchema`. This means that `deleteUserByIdSchema` will have the same
// schema definition as `getUserByIdSchema`, which is a schema for validating the
// request parameters when deleting a user by its ID. */
// export const deleteUserByIdSchema = getUserByIdSchema;
