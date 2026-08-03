import createHttpError from "http-errors";

export default function(req, res, next) {
	return next(createHttpError[404]('Path not found'))
}