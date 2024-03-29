import mongoose from 'mongoose';
import {} from '../dtos/users.dto';

const {Schema} = mongoose;
/* The code is defining a schema for a collection of users in a MongoDB database
using Mongoose. The schema specifies the structure and data types of the fields
in each user document. */
const usersSchema = new Schema({
  id: {type: Number, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  role: {type: String, required: true},
  imageName: {type: String, required: false},
});
export const Users = mongoose.model('Users', usersSchema);
