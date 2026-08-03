import createHttpError from 'http-errors'


export function register(req, res, next) {
	 console.log(x)
	// throw new Error('Custom Error 1')
	// return next(new Error('Custom Error 99'))
	return next(createHttpError[400]('Custom Error CC23'))
	 res.send('Register Controller')
}

export function login(req, res) {
  res.json({
    msg : 'Login Controller',
    body : req.body
  })
}

export function getMe(req, res) {
	res.send('Get me Controller')
}