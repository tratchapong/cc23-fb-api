import { Router } from "express";
import { createLike, createPost, deleteLike, deletePost, getAllPosts } from "../controllers/post.controller.js";

const postRoute = Router()

postRoute.get('/', getAllPosts)
postRoute.post('/:id/like', createLike)
postRoute.delete('/:id/like', deleteLike)
postRoute.post('/', createPost)
postRoute.delete('/:id', deletePost)
// postRoute.put('/:id',updatePost)

// for like


export default postRoute
