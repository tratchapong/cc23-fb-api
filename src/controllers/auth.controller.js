import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import createHttpError from 'http-errors'
import identityKeyUtil from '../utils/identity-key.util.js'
import { loginSchema, registerSchema } from '../validations/schema.js'
import { createUser, getUserBy } from '../services/user.service.js'

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
  // const haveUser = await prisma.user.findUnique({
  //   where: { [identityKey]: identity }
  // })

  const haveUser = await getUserBy(identityKey, identity)
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
  // const result = await prisma.user.create({ data: newUser })
  const result = await createUser(newUser)
  res.json({
    message: 'Register Successful',
    result: result
  })

}

export async function login(req, res, next) {
  const { identity, password } = req.body
  // validation
  loginSchema.parse(req.body)

  const identityKey = identityKeyUtil(identity)
  // find user in DB
  const foundUser = await prisma.user.findFirst({
    where: { [identityKey]: identity }
  })
  if (!foundUser) {
    return next(createHttpError[401]('Invalid login 1'))
  }
  // check password
  let pwOk = await bcrypt.compare(password, foundUser.password)
  if (!pwOk) {
    return next(createHttpError[401]('Invalid Login 2'))
  }
  //  create token
  const payload = { id : foundUser.id }
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm : 'HS256',
    expiresIn : '15d'
  })
  const {password : pw, createdAt, updatedAt, ...userData} = foundUser
  res.json({
    msg: 'Login Controller',
    token: token,
    user: userData
  })
}

export function getMe(req, res) {
  res.json({ user : req.user})
}