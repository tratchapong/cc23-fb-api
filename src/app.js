import express from 'express'
import authRoute from './routes/auth.route.js'
import createHttpError from 'http-errors'

const app = express()

app.use(express.json())

app.use('/api/auth', authRoute )
app.use('/api/post', (req, res)=>{ 
	res.send('post service') 
} )


app.use( (req, res, next) => {
	// res.status(404).json({
	// 	message : 'Path not found'
	// })
	return next(createHttpError[404]('Path not found'))
})

app.use( (err,req,res,next) => {
	console.log("Have Error!!!\n", err)
	res.status(err.status || 500)
	res.json({
		error : err.message
	})
})

export default app

