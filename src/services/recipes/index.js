import express from 'express'
import RecipeModel from './schema.js'
import createHttpError from 'http-errors'
import { JWTAuthMiddleware } from '../../auth/token.js'

const recipesRouter = express.Router()

recipesRouter.post('/', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newRecipe = new RecipeModel(req.body)
    const { _id } = await newRecipe.save()

    res
      .status(201)
      .send(
        `The new recipe ${newRecipe.dishName.toUpperCase()} was added to the DB with the ID: ${_id}`
      )
  } catch (error) {
    console.log(error)
    next(error)
  }
})
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
    const recipeId = req.params.id
    const recipe = await RecipeModel.findById(recipeId)

    if (recipe) {
      res.send(recipe)
    } else {
      console.log(`this is ELSE clg`, createHttpError(404))
      next(
        res.status(404).send({ message: 'HEEEELP!!! ' })
        // createHttpError(404, `The recipe with id ${recipeId} was not found!`)
      )
    }
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
