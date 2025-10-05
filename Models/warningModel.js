import mongoose from "mongoose";
import POST from "./postModel.js";

const warningSchema = new mongoose.Schema({
  type: { type: String, enum: ["post"], default: "post", required: true },
  postId: { type: mongoose.Schema.Types.ObjectId,ref:POST, required: true }, // postId or userId
  message: { type: String, required: true },
});

const WARNING = mongoose.model("warnings", warningSchema);

export default WARNING;
