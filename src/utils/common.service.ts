/**
 * The function creates a response object with error, statusCode, isError, message,
 * and data properties.
 * @param {any} error - The `error` parameter is used to pass any error object or
 * error message that occurred during the execution of the code. It can be of any
 * type, such as an Error object, string, or any custom error object.
 * @param {number} statusCode - The `statusCode` parameter is a number that
 * represents the HTTP status code of the response. It indicates the success or
 * failure of the request.
 * @param {boolean} isError - The `isError` parameter is a boolean value that
 * indicates whether an error occurred or not. If `isError` is `true`, it means an
 * error occurred. If `isError` is `false`, it means no error occurred.
 * @param {string} message - The `message` parameter is a string that represents a
 * message or description related to the response. It can be used to provide
 * additional information or context about the response.
 * @param {any} data - The `data` parameter is used to pass any additional data
 * that you want to include in the response object. It can be of any type, such as
 * an object, array, or string.
 * @returns an object with the following properties: error, statusCode, isError,
 * message, and data.
 */
export async function createResponseObject(
  error: any,
  statusCode: number,
  isError: boolean,
  message: string,
  data: any,
): Promise<{
  error: any;
  statusCode: number;
  isError: boolean;
  message: string;
  data: any;
}> {
  return {
    error,
    statusCode,
    isError,
    message,
    data,
  };
}
