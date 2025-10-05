import mongoose, { mongo } from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
    },
    password: {
      type: String,
      default:null
    },
    profilePic: {
      type: String,
    },
    isActive:{
      type:Boolean,
      default:true
    }
    ,
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      default: null, // unique ID from Google OAuth
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const USER = mongoose.model("users", userSchema);

export default USER
