import express from 'express'
import UserModel from './schema.js'
import createHttpError from 'http-errors'
import { JWTAuthenticate } from '../../auth/tools.js'
import { JWTAuthMiddleware } from '../../auth/token.js'

const usersRouter = express.Router()

usersRouter.post('/register', async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const { _id } = await newUser.save()

    res
      .status(201)
      .send(
        `The new user ${newUser.name.toUpperCase()} ${newUser.surname.toUpperCase()} was created with ID: ${_id}`
      )
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

usersRouter.get('/:id', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id)
    res.send(user)
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.checkCredentials(email, password)
    console.log(user)

    if (user) {
      const accessToken = await JWTAuthenticate(user)
      console.log(accessToken)

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
