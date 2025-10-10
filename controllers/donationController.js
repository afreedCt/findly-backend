import Razorpay from "razorpay";
import DONATION from "../Models/donationModel.js";
import crypto from "crypto";
import USER from "../Models/userModel.js";
import POST from "../Models/postModel.js";
import { sendEmail } from "../utils/sendEmail.js";
export const createOrderController = async (req, res) => {
  try {
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const { amount } = req.body;
    const userId = req.userId;
    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `findly_donation_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    const newDonation = new DONATION({
      userId,
      amount,
      orderId: order.id,
      status: "created",
    });

    await newDonation.save();
    res.status(201).json({
      order,
      newDonation
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const verifyController = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body; 

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
  
    if (expectedSignature === razorpay_signature) {
      const updatedData = await DONATION.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: "paid", paymentId: razorpay_payment_id },
        { new: true }
      ).populate("userId");

      const User = updatedData.userId;
      const option = {
        from: `"Findly Team" <${process.env.EMAIL_USER}>`,
        to: User.email,
        subject: "🎉 Donation Successful – Thank You!",
        html: `
    <h2>Thank You for Your Support!</h2>
    <p>Dear ${User.username},</p>
    <p>We are happy to let you know that your donation of <b>₹${
      updatedData.amount
    }</b> has been successfully received.</p>
    
    <p><b>Donation Details:</b></p>
    <ul>
      <li>Amount: ₹${updatedData.amount}</li>
      <li>Transaction ID: ${updatedData._id}</li>
      <li>Date: ${new Date(updatedData.createdAt).toLocaleString()}</li>
    </ul>

    <p>Your contribution helps us continue our mission. 💙</p>

    <br/>
    <p>With gratitude,</p>
    <p><b>The Findly Team</b></p>
  `,
      };
      await sendEmail(option); 
      res.status(201).json({ 
        success: true,
        message: "Payment verified successfully", 
        paymentData: updatedData,
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.log("verify errror : ", error);
    res.status(500).json({ error: "Verification failed" });
  }
};

export const failedController = async (req, res) => {
  const { order_id, payment_id } = req.body;

  try {
    const updatedOrder = await DONATION.findOneAndUpdate(
      { orderId: order_id },
      { status: "failed", paymentId: payment_id },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "status updated to failed",
      updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ error: "payment failed" });
  }
};

export const getAllDonationController = async (req, res) => {
  try {
    const donations = await DONATION.find().sort({createdAt:-1}).populate({
      path: "userId",
      select: "email username profilePic",
    });
    const totalUsers = await USER.countDocuments({});
    const totalPosts = await POST.countDocuments({});
    const totalPayment = await DONATION.aggregate([
      {
        $group: {
          _id: null,
          totalSum: { $sum: "$amount" },
        },
      },
    ]);

    const totalSum = totalPayment[0]?.totalSum || 0;

    // console.log(totalPayment[0].totalSum)

    res.status(201).json({
      success: true,
      message: "successfully geting all donations",
      donations,
      totalUsers,
      totalPosts,
      totalSum,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "error to get all donations ",
      err: error.message,
    });
  }
};
