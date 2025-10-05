import CLAIM from "../Models/claimModel.js";
import USER from "../Models/userModel.js";
import WARNING from "../Models/warningModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const allUserController = async (req, res) => {
  try {
    const {search}=req.query
    const users = await USER.find({username:{$regex:search,$options:"i"}});
    res
      .status(201)
      .json({ success: true, message: "successfully geting all users", users });
  } catch (error) {
    console.log("error to get all users : ", error);
  }
};

export const allClaimsController = async (req, res) => {
  const { search } = req.query;
  try {
    const claims = await CLAIM.find({
      status: { $regex: search, $options: "i" },
    })
      .populate(["claimerId", "postId"])
      .exec();
    res.status(201).json({
      success: true,
      message: "successfully geting all admin claims",
      claims,
    });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "error to update a claim" });
  }
};

export const userController = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    const user = await USER.findByIdAndUpdate(
      { _id: id },
      { isActive },
      { new: true }
    );
    res
      .status(201)
      .json({ success: true, message: "successfully updated user", user });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "error to block user ",
      err: error.message,
    });
  }
};

export const warningController=async(req,res)=>{
  const {postId,message}=req.body
  try {
    const warning=await WARNING.create({
      postId,
      message
    })
    res.status(201).json({success:true,message:"created warning",warning})
  } catch (error) {
    res.status(501).json({success:false,message:"error to add warning ",err:error.message})
  }
}

export const contactController=async(req,res)=>{
  const {username,email,message}=req.body
  try {
    const option = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: "🎉 Email Message from Contact",
      html: `
      <p>Username : <strong>${username}<strong>,</p>
      <p>Email : <strong>${email}<strong>,</p>
      <p>Message : <strong>${message}<strong></p>
      
      `,
    };
    // console.log(option)
    await sendEmail(option)
    res.status(201).json({success:true,message:"successfully sended message"})
  } catch (error) {
    res.status(501).json({success:false,message:"error to send contact emaill",})
  }
}