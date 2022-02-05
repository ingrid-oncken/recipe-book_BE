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
    difficulty: { type: Number, required: false },
    lastMade: { type: Date, required: false },
    cathegory: {
      type: String,
      required: false,
      enum: ['appetizer', 'main-course', 'deseart'],
    },
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
