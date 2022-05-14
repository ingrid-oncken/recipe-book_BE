import express from 'express'
import RecipeModel from './schema.js'
import { JWTAuthMiddleware } from '../../auth/token.js'
import createError from 'http-errors'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

const recipesRouter = express.Router()

// const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET } = process.env

// cloudinary.config({
//   cloud_name: CLOUDINARY_NAME,
//   api_key: CLOUDINARY_API_KEY,
//   api_secret: CLOUDINARY_SECRET,
// })

// const cloudinaryStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'nft-products-mongo',
//   },
// })

recipesRouter.post(
  '/:userId',
  JWTAuthMiddleware,
  // multer({ filefilter }).array('recipePictures'),
  async (req, res, next) => {
    try {
      console.log(req.user, 'req.user let`s see')
      const newRecipe = new RecipeModel(req.body)
      newRecipe.user = req.params.userId
      // console.log('newRecipe.user', newRecipe.user)
      // console.log('USER HERE', req.user)

      //const { _id } = await newRecipe.save()
      const sendingRecipe = await newRecipe.save()

      res.status(201).send(sendingRecipe)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)
recipesRouter.get(
  '/user/:userId',
  JWTAuthMiddleware,
  async (req, res, next) => {
    //console.log('ANYTHING from user id')
    try {
      const userId = req.params.userId
      //console.log('userId', userId)
      const recipes = await RecipeModel.find({ user: userId })

      res.status(200).send(recipes)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)

// recipesRouter.get('/:id', async (req, res) => {
//   const recipeId = req.params.id
//   console.log('recipeId', recipeId)

//   const recipe = await RecipeModel.findOne({
//     _id: recipeId,
//   }).exec()
//   res.send(recipe)
// })

recipesRouter.get('/:id', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const recipeId = req.params.id
    const recipe = await RecipeModel.findOne({
      _id: recipeId,
    }).exec() //here I can pass a mongo query and find it by ID

    if (!recipe) {
      next(createError(404, `The recipe with id ${recipeId} was not found!`))
    } else {
      res.status(200).send(recipe)
    }
  } catch (error) {
    next(error)
  }
})

recipesRouter.put('/:id', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const recipeId = req.params.id
    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      recipeId,
      req.body,
      {
        new: true,
      }
    )

    if (!updatedRecipe) {
      next(
        createError(
          404,
          `The recipe with id ${recipeId} was not found to be updated!`
        )
      )
    } else {
      res
        .status(200)
        .send(
          `The recipe with id ${recipeId} was sucessfully updated! ${updatedRecipe}`
        )
    }
  } catch (error) {
    next(error)
  }
})
recipesRouter.delete('/:id', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const recipeId = req.params.id
    const deletedRecipe = await RecipeModel.findByIdAndDelete(recipeId)

    if (!deletedRecipe) {
      next(
        createError(
          404,
          `The recipe with id ${recipeId} was not found to be deleted!`
        )
      )
    } else {
      res
        .status(200)
        .send(`The recipe with id ${recipeId} was sucessfully deleted!`)
    }
  } catch (error) {
    next(error)
  }
})

export default recipesRouter
