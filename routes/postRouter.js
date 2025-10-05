import express from 'express'
import { addPostController, deletePostController, getAllPostsController, guestPostsController, matchedPostController, restorePostController, updatePostController } from '../controllers/postController.js'
import jwtMiddleware from '../middlewares/jwtMiddleware.js'
import multerMiddleware from '../middlewares/multerMiddleware.js'

const postRouter=express.Router()

postRouter.post("/create",jwtMiddleware,multerMiddleware.single('postImage'),addPostController)
postRouter.get('/all-posts',jwtMiddleware,getAllPostsController)
postRouter.put("/update-post/:id",jwtMiddleware,multerMiddleware.single('postImage'),updatePostController)
postRouter.delete('/delete-post/:id',jwtMiddleware,deletePostController)
postRouter.get('/guest',guestPostsController)
postRouter.put('/restore/:id',jwtMiddleware,restorePostController)
postRouter.get('/match/:id',jwtMiddleware,matchedPostController)
export default postRouter 