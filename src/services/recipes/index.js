import express from 'express'
import RecipeModel from './schema.js'
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
recipesRouter.get('/', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const recipes = await RecipeModel.find({})

    res.status(200).json(recipes)
  } catch (error) {
    console.log(error)
    next(error)
  }
})
recipesRouter.get('/:id', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const recipeId = req.params.id
    const recipe = await RecipeModel.findById(recipeId) //here I can pass a mongo query and find it by ID

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
