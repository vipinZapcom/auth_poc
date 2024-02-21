import mongoose from 'mongoose';

const {Schema} = mongoose;

/* The code is defining a schema for a collection of courses in a MongoDB database
using Mongoose. The schema specifies the structure and data types of the fields
in each course document. */
const coursesSchema = new Schema({
  id: {type: Number, required: true},
  title: {type: String, required: true},
  description: {type: String, required: true},
});
export const Courses = mongoose.model('Courses', coursesSchema);
