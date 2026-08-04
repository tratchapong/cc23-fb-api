export default function (err, req, res, next) {
	// console.log("Have Error!!!\n", err)

	if (err.name === 'ZodError') {
		return res.status(400).json({
			success: false,
			// errors: err.issues
			errors: err.issues.map(err => err.message)
		})
	}

	res.status(err.status || 500)
	res.json({
		error: err.message
	})
}