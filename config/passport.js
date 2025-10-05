// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

import passport from "passport";
import GoogleOAuth from "passport-google-oauth20";
const GoogleStrategy = GoogleOAuth.Strategy;
import jwt from "jsonwebtoken";
import USER from "../Models/userModel.js";


const setUpPassport=()=>{
    console.log("✅ Google strategy registered");
    passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await USER.findOne({ email: profile.emails[0].value , googleId:profile.id });

        if (!user) {
          user = await USER.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            profilePic: profile.photos[0].value,
            provider: "google",
          });
        }

        // console.log("JWT_SECRET:", process.env.JWT_SECRET);

        // create JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
}


export default setUpPassport