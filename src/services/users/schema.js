import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const { Schema, model } = mongoose

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    googleId: { type: String, required: false },
  },
  { timestamps: true }
)

//.pre .pos are kind of hooks for mongoose
//before saving the user on the DB I'll hash the password
//I am using a plain function so I can use 'this'
UserSchema.pre('save', async function (next) {
  const newUser = this
  const plainPW = newUser.password

  if (newUser.isModified('password')) {
    newUser.password = await bcrypt.hash(plainPW, 10)
  }
  next()
})

//using methods to not show the password on GET
UserSchema.methods.toJSON = function () {
  const userDocument = this
  const userObject = userDocument.toObject()

  delete userObject.password
  delete userObject.__v

  return userObject
}

UserSchema.statics.checkCredentials = async function (email, plainPW) {
  const user = await this.findOne({ email })

  if (user) {
    const isMatch = await bcrypt.compare(plainPW, user.password)
    if (isMatch) return user
    else return null
  } else return null
}

export default model('User', UserSchema)
