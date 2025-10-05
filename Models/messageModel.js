import mongoose from "mongoose";
import USER from "./userModel.js";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.Mixed,
    ref: USER,
    default: "system" // system messages won't have a real user
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER,
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    default: null
  },
  type: {
    type: String,
    enum: ["claimUpdate", "report", "system", "chat"],
    required: true
  },
  title: { 
    type: String,
    required: true,
    trim: true
  },
  text: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["unread", "read"],
    default: "unread"
  },
  email:{
    type:String,
    default:null
  },
  username:{
    type:String,
    default:null
  },
  profilePic:{
    type:String,
    default:null
  }
},{timestamps:true});

const MESSAGE = mongoose.model("messages", messageSchema);
export default MESSAGE;
