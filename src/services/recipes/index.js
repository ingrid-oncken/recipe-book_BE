import express from 'express'
import RecipeModel from './schema.js'
import createHttpError from 'http-errors'
import { JWTAuthMiddleware } from '../../auth/token.js'
import { adminOnlyMiddleware } from '../../auth/admin.js'

const recipesRouter = express.Router()

RecipesRouter.post(
  '/',
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const newRecipe = new RecipeModel(req.body)
      const { _id } = await newRecipe.save()

      res
        .status(201)
        .send(
          `The new recipe ${newRecipe.recipeName.toUpperCase()} was added with the ID: ${_id}`
        )
    } catch (error) {
      // console.log(error)
      next(error)
    }
  }
)
recipesRouter.get('/', async (req, res, next) => {
  try {
    const recipes = await RecipeModel.find({})

    res.status(200).json(recipes)
  } catch (error) {
    console.log(error)
    next(error)
  }
})
recipesRouter.get('/:id', async (req, res, next) => {
  try {
  } catch (error) {
    next(erro)
  }
})
recipesRouter.get('/:id', async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})
recipesRouter.put('/:id', async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

export default recipesRouter
