import mongoose from 'mongoose'

const { Schema, model } = mongoose

const RecipeSchema = new Schema(
  {
    dishName: { type: String, required: true },
    authorName: { type: String, required: true },
    pictures: { type: String, required: false },
    ingredients: { type: String, required: false },
    prepSteps: { type: String, required: false },
    personalNote: { type: String, required: false },
    prepTime: { type: Number, required: false },
    cookingTime: { type: Number, required: false },
    portions: { type: Number, required: false },
    lastMade: { type: Date, required: false },
    prepMethods: {
      type: String,
      required: false,
      enum: [
        'oven',
        'stove',
        'robot',
        'deep-fry',
        'air-fry',
        'multicooker',
        'BBQ',
        'sous-vide',
        'microwave',
      ],
    },

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