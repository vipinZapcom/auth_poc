// Uncomment these imports to begin using these cool features!

import {get} from '@loopback/rest';

// import {inject} from '@loopback/core';

const str: string = '/hello';
export class CourseController {
  constructor() {}
  @get(str)
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
              example: 'all posts have been fetched successfully',
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
  // This is the corresponding function that will handle the GET all posts request
  async getAllPosts(): Promise<{
    data: (Post | undefined)[];
    statusCode: number;
    isError: boolean;
    error: string;
  }> {
    return await fetchAllPosts();
  }
}
