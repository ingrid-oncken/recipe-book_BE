import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'

import {
  unauthorizedHandler,
  forbidenHandler,
  catchAllHandler,
} from './errorHandlers.js'

const server = express()
const port = process.env.PORT || 3002

//***************** MIDDLEWARE ****************/

server.use(cors())
server.use(express.json())

//***************** ROUTES ****************/

server.use('/users', usersRouter)
// server.use('/recipes', recipesRouter)
// server.use('/carts', cartsRouter)

//***************** ERROR HANDLERS ****************/

server.use(unauthorizedHandler)
server.use(forbidenHandler)
server.use(catchAllHandler)

console.table(listEndpoints(server, port))
mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on('connected', () => {
  console.log('🐒 Mongo Connected 👍')
  server.listen(port, () => {
    console.log(`🏃Server running on port 🚪${port}`)
  })
})

