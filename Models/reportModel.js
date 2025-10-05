import mongoose from "mongoose";
import USER from "./userModel.js";
import POST from "./postModel.js";

const reportSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["post", "user"], required: true },
    reportedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: POST, // Only if type = "post"
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER, // Only if type = "user"
    },
    reason: { type: String, required: true }, // e.g. spam, fraud, fake post
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: USER },
    status: {
      type: String,
      enum: ["pending", "dismiss", "removed", "baned", "deleted", "warned"],
      default: "pending",
    },
    reportedCount:{
      type:Number,
    },
    postCount:{
      type:Number
    }
  },
  { timestamps: true }
);

const REPORT = new mongoose.model("reports", reportSchema);

export default REPORT;
