import express from 'express'
import authRoute from './routes/auth.route.js'
import createHttpError from 'http-errors'
import notFoundMiddleware from './middlewares/notFound.middleware.js'
import errorMiddleware from './middlewares/error.middleware.js'
import authenticateMiddleware from './middlewares/authenticate.middleware.js'

const app = express()

app.use(express.json())

app.use('/api/auth', authRoute )
app.use('/api/post', authenticateMiddleware , (req, res)=>{ 
	res.json({
		message : 'Post service api',
		user : req.user
	}) 
} )

app.use(notFoundMiddleware)

app.use(errorMiddleware)

export default app

