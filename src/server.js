import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import listEndpoints from 'express-list-endpoints'
import usersRouter from './services/users/index.js'
import recipesRouter from './services/recipes/index.js'

import GoogleStrategy from './auth/oauth.js'
import {
  unauthorizedHandler,
  forbidenHandler,
  catchAllHandler,
  badRequestHandler,
  notFoundHandler,
} from './errorHandlers.js'

const server = express()
const port = process.env.PORT || 3002

passport.use('google', GoogleStrategy)

//***************** MIDDLEWARE ****************/

server.use(cors())
server.use(express.json())
server.use(passport.initialize())

//***************** ROUTES ****************/

server.use('/users', usersRouter)
server.use('/recipes', recipesRouter)

//***************** ERROR HANDLERS ****************/

server.use(unauthorizedHandler)
server.use(forbidenHandler)
server.use(notFoundHandler)
server.use(badRequestHandler)
server.use(catchAllHandler)

console.table(listEndpoints(server, port))
mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on('connected', () => {
  console.log('π Mongo Connected π')
  server.listen(port, () => {
    console.log(`πServer running on port πͺ${port}`)
  })
})
