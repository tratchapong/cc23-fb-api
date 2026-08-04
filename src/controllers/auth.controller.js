import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import createHttpError from 'http-errors'
import identityKeyUtil from '../utils/identity-key.util.js'
import { registerSchema } from '../validations/schema.js'

export async function register(req, res, next) {
  const { identity, firstName, lastName, password, confirmPassword } = req.body
  // validation
  const data = registerSchema.parse(req.body)
  console.log(data)

  // check Identity is email or mobile
  const identityKey = identityKeyUtil(identity)
  if (!identityKey) {
    return next(createHttpError[400]('identity must be email or phone number'))
  }
  // find user for non-duplicate
  const haveUser = await prisma.user.findUnique({
    where: { [identityKey]: identity }
  })
  if (haveUser) {
    return next(createHttpError[409]('This user already register'))
  }
  // create user
  const newUser = {
    [identityKey]: identity,
    password: await bcrypt.hash(password, 10),
    firstName: firstName,
    lastName: lastName
  }
  const result = await prisma.user.create({ data: newUser })
  res.json({
    message: 'Register Successful',
    result: result
  })

}

export function login(req, res) {
  res.json({
    msg: 'Login Controller',
    body: req.body
  })
}

export function getMe(req, res) {
  res.send('Get me Controller')
}