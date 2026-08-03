import createHttpError from 'http-errors'


export function register(req, res, next) {
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