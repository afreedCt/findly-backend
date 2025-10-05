import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  amount: Number, 
  orderId: String,
  paymentId: String,
  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created",
  },
},{timestamps:true});

const DONATION=mongoose.model("donations", donationSchema);
export default DONATION 