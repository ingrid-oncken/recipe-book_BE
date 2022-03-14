import express from 'express'
import RecipeModel from './schema.js'
//import createError from 'http-errors'
import { JWTAuthMiddleware } from '../../auth/token.js'
import createError from 'http-errors'

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
    console.log('this is clg of recipe line 37', recipe)

    if (recipe) {
      res.send(recipe)
    } else {
      //console.log(`this is ELSE clg`, createError(401))

      next(createError(404, `The recipe with id was not found!`))
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
