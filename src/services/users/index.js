import express from 'express'
import passport from 'passport'
import UserModel from './schema.js'
import createHttpError from 'http-errors'
import { JWTAuthenticate } from '../../auth/tools.js'
import { JWTAuthMiddleware } from '../../auth/token.js'

const usersRouter = express.Router()

usersRouter.post('/register', async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const user = await newUser.save()

    res.status(201).send({ newUser })
  } catch (error) {
    next(error)

    next(error)
  }
})

// /me are the personal routes accessed by the user
//attaching the CURRENT LOGGED USER to the request
usersRouter.get('/me', JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    next(error)
  }
})

usersRouter.put('/me', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const userID = req.user._id
    const updatedUser = await UserModel.findByIdAndUpdate(userID, req.body, {
      new: true,
    })

    updatedUser
      ? res.send(updatedUser)
      : next(createHttpError(404, `User with id ${userID} not found!`))
  } catch (error) {
    next(error)
  }
})

usersRouter.delete('/me', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const deletedUser = await req.user.deleteOne()

    if (deletedUser) {
      res.status(204).send()
    } else {
      next(createError(404, `The user was not found!`))
    }
  } catch (error) {
    next(error)
  }
})

// this route is only getting in touch with google, doesn't need response or anything else
// because the second route is taking care of it
usersRouter.get(
  '/googleLogin',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)
usersRouter.get(
  '/googleRedirect',
  passport.authenticate('google'),
  async (req, res, next) => {
    try {
      console.log('Redirect ---->')
      console.log(`clg req.user`, req.user)
      res.redirect('http://localhost:3000?accessToken=' + req.user.token)
    } catch (error) {
      next(error)
    }
  }
)

usersRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.checkCredentials(email, password)
    console.log(`This is the user inside users/login ${user}`)

    if (user) {
      const accessToken = await JWTAuthenticate(user)
      console.log(`This is the access token inside users/login ${accessToken}`)

      //frotend will get this token and save on local storage
      res.send({ accessToken })
    } else {
      next(createHttpError(401, '401: Credentials are not correct!'))
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter
