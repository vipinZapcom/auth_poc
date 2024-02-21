# Posts DTO

This file defines types and schemas related to posts.

### Post Type

The `Post` type represents the structure of a post, including fields like `userId`, `id`, `body`, and `title`.

### CreateNewPostPayload Type

The `CreateNewPostPayload` type is an object that contains all fields of a post except for the `id` field. It is used for creating new posts.

### PutPostPayload Type

The `PutPostPayload` type is the same as the `Post` type, representing the structure of a post. It is used for updating posts via a PUT request, where the entire post object needs to be provided.

### PatchPostPayload Type

The `PatchPostPayload` type represents a partial update to a post. It contains optional fields for `title` and `body` that can be updated individually.

## Schemas

- **getPostByIdSchema**: Schema for validating the request parameters when retrieving a post by its ID.
- **createPostsSchema**: Schema for validating the request body when creating a new post.
- **patchPostsSchema**: Schema for validating the request body when updating a post partially.
- **putPostsSchema**: Schema for validating the request body when updating a post completely.
- **deletePostByIdSchema**: Schema for validating the request parameters when deleting a post by its ID.

For detailed documentation on each schema, see the corresponding annotations in the code.

```typescript
import Joi from "joi";
import * as _ from "lodash";

export type Post = {
  userId: number;
  id: number;
  body: string;
  title: string;
};

export type CreateNewPostPayload = _.Omit<Post, "id">;

export type PutPostPayload = Post;

export type PatchPostPayload = Partial<Pick<Post, "title" | "body">>;

const postIdSchema = Joi.number().integer().positive().min(1);
const titleSchema = Joi.string().trim().max(1000);
const bodySchema = Joi.string().trim().max(1000);

export const getPostByIdSchema = Joi.object({
  postId: postIdSchema.required().messages({
    "number.base": "postId passed in URL must be a number",
    "number.min":
      "postId passed in URL should be a number greater than or equal to 1",
  }),
});

export const createPostsSchema = Joi.object({
  title: titleSchema.required(),
  body: bodySchema.required(),
  userId: postIdSchema.required().messages({
    "number.positive": "userId should be greater than 0",
  }),
});

export const patchPostsSchema = Joi.object({
  title: titleSchema,
  body: bodySchema,
  postId: postIdSchema.required().messages({
    "number.base": "id passed in URL must be a number",
    "number.min":
      "id passed in URL should be a number greater than or equal to 1",
  }),
})
  .or("title", "body")
  .messages({
    "object.missing": "either title or body is required",
  });

export const putPostsSchema = Joi.object({
  userId: postIdSchema.required(),
  title: titleSchema.required(),
  body: bodySchema.required(),
  id: postIdSchema.required(),
  postId: Joi.number().min(1).required().valid(Joi.ref("id")).messages({
    "number.base": "id passed in URL must be a number",
    "number.min":
      "id passed in URL should be a number greater than or equal to 1",
    "any.only":
      "id passed in URL must be equal to the id passed in the request body",
  }),
});

export const deletePostByIdSchema = getPostByIdSchema;
