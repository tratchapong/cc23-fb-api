import { z, ZodError } from 'zod'

export default function (err, req, res, next) {
	console.log("Have Error!!!\n", err)

	if (err.name === 'TokenExpiredError') {
		return res.status(401).json({
			error: 'Token Expired',
			message: 'Your session has expired. Please log in again.'
		});
	}

	if (err.name === 'JsonWebTokenError') {
		return res.status(401).json({
			error: 'Invalid Token',
			message: 'The provided token is invalid or malformed.'
		});
	}

	if (err instanceof ZodError) {
		console.log('Zod Error :', z.flattenError(err))
		return res.status(400).json({
			success: false,
			message: 'Validation Error',
			errors: z.flattenError(err).fieldErrors
			// errors: err.issues
			// errors: err.issues.map(err => err.message)
		})
	}

	res.status(err.status || 500)
	res.json({
		error: err.message
	})
}