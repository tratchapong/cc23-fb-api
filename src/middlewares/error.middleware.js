export default function (err, req, res, next) {
	console.log("Have Error!!!\n", err)
	res.status(err.status || 500)
	res.json({
		error: err.message
	})
}