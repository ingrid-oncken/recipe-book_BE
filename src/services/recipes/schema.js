import mongoose from 'mongoose'

const { Schema, model } = mongoose

const RecipeSchema = new Schema(
  {
    recipeName: { type: String, required: true },
    description: { type: String, required: true },

    image: { type: String, required: false },
    // language: {
    //   type: String,
    //   default: 'English',
    //   required: true,
    //   enum: ['English', 'Português', 'Italiano', 'Español', 'Deutsch'],
    // },
    // category: {
    //   type: String,
    //   default: 'VCDS®',
    //   required: true,
    //   enum: ['VCDS®', 'HEX-V2', 'HEX-NET', 'HEX-NET® Pro', 'Software'],
    // },
    // price: { type: Number, required: true },
    // stock: { type: Number, required: false },
    // available: { type: Boolean, required: true },
  },
  { timestamps: true }
)

RecipeSchema.methods.toJSON = function () {
  const recipeDocument = this
  const recipeObject = recipeDocument.toObject()

  delete recipeObject.__v
  delete recipeObject.stock

  return recipeObject
}

export default model('Recipe', RecipeSchema)
