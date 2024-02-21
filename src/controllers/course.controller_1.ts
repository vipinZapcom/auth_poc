// Uncomment these imports to begin using these cool features!

import {get} from '@loopback/rest';
import {COURSE_ENDPOINTS} from '../constants';
import {Course} from '../dtos/courses.dto';
import {fetchAllCourses} from '../services/courses.service';

// import {inject} from '@loopback/core';

export class CourseController {
  constructor() {}
  @get(COURSE_ENDPOINTS.GET_ALL_COURSES.PATH)

  // This is the corresponding function that will handle the GET all posts request
  async getAllPosts(): Promise<{
    data: (Course | undefined)[];
    statusCode: number;
    isError: boolean;
    error: string;
  }> {
    return await fetchAllCourses();
  }
}
