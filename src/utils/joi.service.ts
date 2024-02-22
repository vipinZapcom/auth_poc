import Joi from 'joi';
/**
 * The function `validateRequestBody` is a TypeScript function that validates a
 * request body against a Joi validation schema and returns an error message if the
 * validation fails.
 * @param {any} requestBody - The `requestBody` parameter is the data that needs to
 * be validated. It can be of any type, as it is defined as `any` in the function
 * signature.
 * @param joiValidationSchema - The `joiValidationSchema` parameter is a schema
 * object provided by the Joi library. It is used to define the structure and
 * validation rules for the `requestBody` object.
 * @returns a Promise that resolves to either an object with properties `isError`,
 * `error`, `data`, and `statusCode`, or `undefined`.
 */

export async function validateRequestBody(
  requestBody: any,
  joiValidationSchema: Joi.ObjectSchema<any>,
): Promise<
  | {
      isError: boolean;
      error: string;
      data: never[];
      statusCode: number;
    }
  | undefined
> {
  const {error, value} = joiValidationSchema.validate(requestBody, {
    abortEarly: false,
  });
  let errorMessage: string = '';
  if (error && Object.keys(error).length) {
    errorMessage = error.details
      .map((detail: {message: any}) => detail.message)
      .join(', ');
  }
  if (!errorMessage.length) {
    return;
  }
  return {
    isError: true,
    error: `Bad Request ${errorMessage}`,
    data: [],
    statusCode: 400,
  };
}
