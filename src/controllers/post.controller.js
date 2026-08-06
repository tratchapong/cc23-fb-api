import createHttpError from 'http-errors'
import { prisma } from "../lib/prisma.js"


export const getAllPosts = async (req, res) => {
	const result = await prisma.post.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			user: { select: { firstName: true, lastName: true, profileImage: true } },
			comments: {
				include: { user: { select: { firstName: true, lastName: true, profileImage: true } } }
			},
			likes: {
				include: { user: { select: { firstName: true, lastName: true } } }
			}
		},
	})
	res.json({ posts: result })
}

export const createPost = async (req, res) => {
	const { message, image } = req.body
	console.log(req.user)

	const data = { message: message, image: image, userId: req.user.id }

	const result = await prisma.post.create({ data })

	res.status(201).json({
		message: 'Create new Post done',
		result
	})
}

export const deletePost = async (req, res, next) => {
	const { id } = req.params

	const foundPost = await prisma.post.findUnique({
		where: { id: +id }
	})
	if (!foundPost) {
		return next(createHttpError[404]('Data not found'))
	}

	if (req.user.id != foundPost.userId) {
		return next(createHttpError[401]('Cannot delete this post'))
	}

	const result = await prisma.post.delete({ where: { id: +id } })
	res.json({
		message: 'Delete done'
	})
}

export const createLike = async (req, res, next) => {
	const { id } = req.params
	const postData = await prisma.post.findUnique({
		where: { id: +id }
	})
	if (!postData) {
		return next(createHttpError[401]('cannot like this post'))
	}
	const haveLike = await prisma.like.findUnique({
		where: {
			userId_postId: {
				userId: req.user.id,
				postId: +id
			}
		}
	})
	if (haveLike) {
		return next(createHttpError[400]('already like this post'))
	}

	const result = await prisma.like.create({
		data: { userId: req.user.id, postId: +id }
	})
	res.json({
		message: 'Like done',
		result
	})
}

export const deleteLike = async (req, res, next) => {
	const { id } = req.params
	console.log(id)
	const haveLike = await prisma.like.findUnique({
		where: {
			userId_postId: {
				userId: req.user.id,
				postId: +id
			}
		}
	})
	if (!haveLike) {
		return next(createHttpError[400]('already unlike this post'))
	}
	const result = await prisma.like.delete({
		where: {
			userId_postId: {
				userId: req.user.id,
				postId: +id
			}
		}
	})
	res.json({
		message: 'unLike done',
		result
	})
}