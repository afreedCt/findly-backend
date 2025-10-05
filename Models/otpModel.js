import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    // uniue: true,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt:{
    type:Date
  }
});

const OTP=new mongoose.model("otp",otpSchema)
 
export default OTP
