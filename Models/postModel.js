import mongoose from "mongoose";
import USER from "./userModel.js";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      // required:true
    },
    type: {
      type: String,
      enum: ["found", "lost"],
    },
    postImage: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER,
      // required:true
    },
  },
  { timestamps: true }
); 

// postSchema.index(
//   { title: "text", description: "text", location: "text" },
//   { weights: { title: 5, description: 3, location: 1 } }
// );

const POST = mongoose.model("posts", postSchema);

export default POST;
