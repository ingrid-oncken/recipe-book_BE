import mongoose from 'mongoose'

const { Schema, model } = mongoose

const RecipeSchema = new Schema(
  {
    recipeTitle: { type: String, required: false },
    authorName: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    cathegory: {
      type: String,
      required: false,
      enum: [
        'Cathegory',
        'Brekfast',
        'Salad',
        'Lunch/Dinner',
        'Soup',
        'Snack',
        'Desseart',
      ],
    },
    nPortions: { type: String, required: false },
    prepTime: { type: String, required: false },
    totalTime: { type: String, required: false },
    prepMethods: [
      {
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
    ],
    tags: [
      {
        type: String,
        required: false,
        enum: [
          'Appetizer',
          'Fish',
          'Fit',
          'Gluten-free',
          'Halal',
          'Kosher',
          'Meat',
          'Poultry',
          'Seafood',
          'Tapas',
          'Vegan',
          'Ovolacto-vegetarian',
        ],
      },
    ],
    ingredients: [{ type: String, required: false }],
    prepSteps: [{ type: String, required: false }],
    personalNote: [{ type: String, required: false }],
    pictures: [
      {
        type: String,
        required: false,
        default: 'https://ibb.co/kBZj2xf',
      },
    ],
  },
  { timestamps: false }
)

RecipeSchema.methods.toJSON = function () {
  const recipeDocument = this
  const recipeObject = recipeDocument.toObject()

  delete recipeObject.__v
  delete recipeObject.stock

  return recipeObject
}

export default model('Recipe', RecipeSchema)
