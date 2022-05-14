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
recipesRouter.get('/:userId', JWTAuthMiddleware, async (req, res, next) => {
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
})

recipesRouter.get('/', async (req, res) => {
  const recipe = await RecipeModel.findOne({
    _id: '62693608c346cf192415027f',
  }).exec()
  res.send(recipe)
})

// recipesRouter.get('/', async (req, res) {
//   const recipe = await RecipeModel.findOne({_id: '62693608c346cf192415027f'}).exec(function(err, leads){
//     console.log('recipe from get ONE', recipe)
//     //res.send(recipe)
//     res.send(recipe)})
// })

//findOne({ _id: id })

// router.get('/findByContactName/:surname', function(req, res){
// Lead.find({"contacts.surname":req.params.name}).exec(function(err, leads){
// res.send(leads);
// });

// recipesRouter.get('/:id', JWTAuthMiddleware, async (req, res, next) => {
//   console.log('ANYTHING')
//   try {
//     const recipeId = req.params.id
//     const recipe = await RecipeModel.findById(recipeId) //here I can pass a mongo query and find it by ID
//     console.log('recipe', recipe)
//     if (!recipe) {
//       next(createError(404, `The recipe with id ${recipeId} was not found!`))
//     } else {
//       res.status(200).send(recipe)
//     }
//   } catch (error) {
//     next(error)
//   }
// })

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
