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

	const data = { message : message, image :image, userId: req.user.id }

	const result = await prisma.post.create({ data })

	res.status(201).json({
		message: 'Create new Post done',
		result
	})
}
