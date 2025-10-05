import mongoose, { mongo } from "mongoose";
import USER from "./userModel.js";
import POST from "./postModel.js";

const claimSchema=new mongoose.Schema({
    // postId:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:POST,
    //     required:true
    // },
    postId:{
        type:mongoose.Schema.Types.Mixed,
        ref:POST,
        required:true
    },
    claimerId:{
        type:mongoose.Schema.Types.Mixed,
        ref:USER,
        required:true
    },
    message:{
        type:String,
        required:true 
    },
    status:{
        type:String,
        default:"pending"
    },
},{timestamps:true})

const CLAIM=mongoose.model("claims",claimSchema)

export default CLAIM