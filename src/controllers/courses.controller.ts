import {intercept} from '@loopback/context';
import {inject} from '@loopback/core';
import {
  Request,
  ResponseObject,
  RestBindings,
  del,
  get,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {COURSE_ENDPOINTS} from '../constants';
import {
  CreateNewCoursePayload,
  PatchCoursePayload,
  PutCoursePayload,
} from '../dtos/courses.dto';
import {LoggingInterceptor} from '../interceptors/courses.interceptors';
import {checkRights} from '../interceptors/users.interceptors';
import {
  createNewCourse,
  deleteCourseById,
  fetchAllCourses,
  fetchCourseById,
  modifyCourseViaPatch as modifyCourse,
} from '../services/courses.service';
import {ResponseDTO} from '../utils/common.dtos';
// This Controller deals with all the CRUD operations( Create Course, Update Course, Delete Course) related to Courses
export class CoursesController {
  constructor() {}
  // This controller `GET /courses` will handle the request when we want all the courses present in our database
  @get(COURSE_ENDPOINTS.GET_ALL_COURSES)
  @response(200, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: {type: 'null'},
            statusCode: {type: 'integer', example: 200},
            isError: {type: 'boolean', example: false},
            message: {
              type: 'string',
              example: 'all courses have been fetched successfully',
            },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: {type: 'string', example: '65bb395ef93ccd6727d8353b'},
                  id: {type: 'integer', example: 1},
                  userId: {type: 'integer', example: 1},
                  title: {
                    type: 'string',
                    example:
                      'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
                  },
                  body: {
                    type: 'string',
                    example:
                      'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
                  },
                  __v: {type: 'integer', example: 0},
                },
              },
            },
          },
        },
      },
    },
  })
  @response(404, {
    description: 'Not Found',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: {type: 'null'},
            statusCode: {type: 'integer', example: 404},
            isError: {type: 'boolean', example: false},
            message: {
              type: 'string',
              example: 'no course exists to be displayed',
            },
            data: {
              type: 'array',
              example: [],
            },
          },
        },
      },
    },
  })
  @response(500, {
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: {type: 'string', example: 'Internal Server Error'},
            isError: {type: 'boolean', example: true},
            data: {type: 'null', example: null},
            statusCode: {type: 'integer', example: 500},
          },
        },
      },
    },
  })
  @intercept(checkRights(['read_only', 'update_only', 'admin']))
  // This is the corresponding function that will handle the GET all courses request
  async getAllCourses(): Promise<ResponseDTO> {
    return await fetchAllCourses();
  }

  /*This controller `GET /courses/{courseId}` will handle the request when we want the course with the given courseId like /courses/1
    will provide me the course content having the id as 1
   */
  @get(COURSE_ENDPOINTS.GET_COURSE_BY_ID)
  @response(200, {
    description: 'Success',
    headers: {
      'Content-Type': 'application/json',
    },
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: {type: 'string', example: ''},
            isError: {type: 'boolean', example: false},
            data: {
              type: 'object',
              properties: {
                _id: {type: 'string', example: '65cb405719115d990ad1bee5'},
                id: {type: 'integer', example: 102},
                userId: {type: 'integer', example: 1},
                title: {type: 'string', example: 'new title'},
                body: {type: 'string', example: 'hhhhh'},
                __v: {type: 'integer', example: 0},
              },
            },
            statusCode: {type: 'integer', example: 200},
          },
        },
      },
    },
  })
  @response(404, {
    description: 'Not Found',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: "course having id 103 doesn't exists",
            },
            isError: {type: 'boolean', example: false},
            data: {type: 'array', example: []},
            statusCode: {type: 'integer', example: 404},
          },
        },
      },
    },
  })
  @response(500, {
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: {type: 'string', example: 'Internal Server Error'},
            isError: {type: 'boolean', example: true},
            data: {type: 'null', example: null},
            statusCode: {type: 'integer', example: 500},
          },
        },
      },
    },
  })
  @intercept(
    checkRights(['read_only', 'update_only', 'admin']),
    new LoggingInterceptor().fetchCourseByIdInterceptor,
  )
  // This is the corresponding function that will handle the GET course by id request
  async getCourseById(
    @param.path.string('courseId') courseId: string,
  ): Promise<{
    error: string | null;
    isError: boolean;
    data: any;
    statusCode: number;
  }> {
    return await fetchCourseById(parseInt(courseId));
  }

  /*
  This controller `COURSE /courses` will deal with creating the new course and if the course exists in the database then it will
  give us error
  */
  @post(COURSE_ENDPOINTS.CREATE_NEW_COURSE)
  @response(201, {
    description: 'Created',
    headers: {
      'Content-Type': {
        type: 'string',
        schema: {type: 'string', example: 'application/json'},
      },
      'X-Status-Code': {
        type: 'number',
      },
    },
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: {type: 'integer', example: 103},
                userId: {type: 'integer', example: 1},
                title: {type: 'string', example: 'Ankur Kumar'},
                body: {type: 'string', example: 'New course body'},
                _id: {type: 'string', example: '65cc3ac52f646225b1c51db3'},
                __v: {type: 'integer', example: 0},
              },
            },
            statusCode: {type: 'integer', example: 201},
            isError: {type: 'boolean', example: false},
            error: {type: 'string', example: ''},
          },
        },
      },
    },
  })
  @response(400, {
    description: 'Bad Request',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            isError: {type: 'boolean', example: true},
            error: {
              type: 'string',
              example: 'Bad Request "userId" is required',
            },
            data: {type: 'array', example: []},
            statusCode: {type: 'integer', example: 400},
          },
        },
      },
    },
  })
  @response(500, {
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: {type: 'string', example: 'Internal Server Error'},
            isError: {type: 'boolean', example: true},
            data: {type: 'null', example: null},
            statusCode: {type: 'integer', example: 500},
          },
        },
      },
    },
  })
  @intercept(
    checkRights(['admin']),
    new LoggingInterceptor().createCourseInterceptor,
  )
  // This is the corresponding function that will deal with the creation of new course
  async createNewCourse(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              userId: {
                type: 'number',
                description: 'required Field',
                example: 1,
              },
              body: {
                type: 'string',
                description: 'required Field',
                example: 'new course body',
              },
              title: {
                type: 'string',
                description: 'required Field',
                example: 'new course title',
              },
            },
          },
        },
      },
    })
    createNewCoursePayload: CreateNewCoursePayload,
  ) {
    return await createNewCourse(createNewCoursePayload);
  }

  /*
   This controller `PATCH /courses/{courseId}` will deal with all the request which corresponds to updating the course title and body
   for the courseId which will be passed in the url
  */
  @patch(COURSE_ENDPOINTS.UPDATE_COURSE_BY_ID)
  @response(200, {
    description: 'Success',
    headers: {
      'Content-Type': {
        type: 'string',
        schema: {type: 'string', example: 'application/json'},
      },
    },
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                _id: {type: 'string', example: '65cb405719115d990ad1bee5'},
                id: {type: 'integer', example: 102},
                userId: {type: 'integer', example: 1},
                title: {type: 'string', example: 'new title'},
                body: {type: 'string', example: 'hhhhh'},
                __v: {type: 'integer', example: 0},
              },
            },
            isError: {type: 'boolean', example: false},
            statusCode: {type: 'integer', example: 200},
            error: {type: 'string', example: null},
          },
        },
      },
    },
  })
  @response(400, {
    description: 'Bad Request',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            isError: {type: 'boolean', example: true},
            error: {
              type: 'string',
              example: 'Bad Request "body" is not allowed to be empty',
            },
            data: {type: 'array', example: []},
            statusCode: {type: 'integer', example: 400},
          },
        },
      },
    },
  })
  @response(500, {
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: {type: 'string', example: 'Internal Server Error'},
            isError: {type: 'boolean', example: true},
            data: {type: 'null', example: null},
            statusCode: {type: 'integer', example: 500},
          },
        },
      },
    },
  })
  @intercept(
    checkRights(['update_only', 'admin']),
    new LoggingInterceptor().patchCourseInterceptor,
  )
  // This is the corresponding function that will deal with the updating the course content via PATCH
  async patchGivenCourse(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            description:
              'title, description or both title or body can be updated at once',
            properties: {
              title: {
                type: 'string',
                description: 'optional Field',
                example: 'title to be updated',
              },
              body: {
                type: 'string',
                description: 'optional Field',
                example: 'new body to be updated',
              },
            },
          },
        },
      },
    })
    patchRequestPayload: PatchCoursePayload,
    @param.path.string('courseId') id: string,
  ) {
    return await modifyCourse(parseInt(id), patchRequestPayload);
  }

  /*
  This controller `PUT /courses/{courseId}` will deal with al the request coming to update the course content which includes
   id, title, body and userId.
   Note: We should pass the same courseId (in the url) and id( in the request body) for the function to work.
  */
  @put(COURSE_ENDPOINTS.REPLACE_COURSE_BY_ID)
  @response(200, {
    description: 'Success',
    headers: {
      'Content-Type': {
        type: 'string',
        schema: {type: 'string', example: 'application/json'},
      },
    },
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                _id: {type: 'string', example: '65cb405719115d990ad1bee5'},
                id: {type: 'integer', example: 102},
                userId: {type: 'integer', example: 1},
                title: {type: 'string', example: 'new title'},
                body: {type: 'string', example: 'hhhhh'},
                __v: {type: 'integer', example: 0},
              },
            },
            isError: {type: 'boolean', example: false},
            statusCode: {type: 'integer', example: 200},
            error: {type: 'string', example: null},
          },
        },
      },
    },
  })
  @response(400, {
    description: 'Bad Request',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            isError: {type: 'boolean', example: true},
            error: {type: 'string', example: 'Bad Request "body" is required'},
            data: {type: 'array', example: []},
            statusCode: {type: 'integer', example: 400},
          },
        },
      },
    },
  })
  @response(500, {
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: {type: 'string', example: 'Internal Server Error'},
            isError: {type: 'boolean', example: true},
            data: {type: 'null', example: null},
            statusCode: {type: 'integer', example: 500},
          },
        },
      },
    },
  })
  @intercept(
    checkRights(['update_only', 'admin']),
    new LoggingInterceptor().putCourseInterceptor,
  )
  // This is the corresponding function that will deal with updating the course content via PUT
  async putGivenCourse(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            description: 'All fields are required here',
            properties: {
              body: {type: 'string', example: 'new body to be updated'},
              title: {type: 'string', example: 'new title to be updated'},
              userId: {type: 'integer', example: 1},
              id: {
                type: 'integer',
                example: 100,
                description:
                  'Note this id should be equal to the courseId passed in the url',
              },
            },
          },
        },
      },
    })
    putRequestPayload: PutCoursePayload,
    @param.path.string('courseId') id: string,
  ) {
    return await modifyCourse(parseInt(id), putRequestPayload);
  }

  /*
  This controller `DEL /courses/{courseId}` will delete the corresponding course having the courseId which is passed in the url
  */
  @del(COURSE_ENDPOINTS.DELETE_COURSE_BY_ID)
  @response(204, {
    description: 'No Content',
    headers: {
      'Content-Type': {
        type: 'string',
        schema: {type: 'string', example: 'application/json'},
      },
    },
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                acknowledged: {type: 'boolean', example: true},
                deletedCount: {type: 'integer', example: 1},
              },
            },
            error: {type: 'string', example: ''},
            isError: {type: 'boolean', example: false},
            statusCode: {type: 'integer', example: 204},
          },
        },
      },
    },
  })
  @response(404, {
    description: 'Not Found',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {type: 'array', example: []},
            error: {
              type: 'string',
              example: "courseId 103 doesn't exists to be deleted",
            },
            isError: {type: 'boolean', example: false},
            statusCode: {type: 'integer', example: 404},
          },
        },
      },
    },
  })
  @response(500, {
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: {type: 'string', example: 'Internal Server Error'},
            isError: {type: 'boolean', example: true},
            data: {type: 'null', example: null},
            statusCode: {type: 'integer', example: 500},
          },
        },
      },
    },
  })
  @intercept(
    checkRights(['admin']),
    new LoggingInterceptor().deleteCourseInterceptor,
  )
  // This is the corresponding function that will deal with deleting the course when the courseId is passed in the url
  async deleteGivenCourse(
    @param.path.string('courseId') courseId: string,
    @inject(RestBindings.Http.REQUEST) request: Request,
    @inject(RestBindings.Http.RESPONSE) response: ResponseObject,
  ) {
    return await deleteCourseById(parseInt(courseId), request);
  }
}
