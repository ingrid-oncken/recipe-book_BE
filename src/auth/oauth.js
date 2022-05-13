import passport from 'passport'
import { JWTAuthenticate } from './tools.js'
import UserModel from '../services/users/schema.js'
import GoogleStrategy from 'passport-google-oauth20'

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `${process.env.API_URL}:${process.env.PORT}/users/googleRedirect`,
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {
      //console.log(`Receiving profile info from google`, profile)
      //is the user in DB ? YES-create token : NO-create new user and then generate token
      const user = await UserModel.findOne({ googleId: profile.id })

      if (user) {
        // YES-create token

        const token = await JWTAuthenticate(user)

        passportNext(null, { token })
      } else {
        // NO-create new user and then generate token
        const newUser = {
          firstName: profile.name.givenName,
          surname: profile.name.familyName,
          email: profile.emails[0].value,
          googleId: profile.id,
        }

        const createdUser = new UserModel(newUser)
        const savedUser = await createdUser.save()
        const token = await JWTAuthenticate(savedUser)

        passportNext(null, { user: savedUser, token })
      }
    } catch (error) {
      console.log(error)
      passportNext(error)
    }
  }
)
passport.serializeUser(function (user, passportNext) {
  passportNext(null, user) // this is adding info to the user, in this case the token
})
export default googleStrategy
