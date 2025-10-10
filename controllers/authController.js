import { OAuth2Client } from "google-auth-library";
import USER from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import otpGenerate from "../utils/otpGenerate.js";
import { sendEmail } from "../utils/sendEmail.js";
import OTP from "../Models/otpModel.js";
import bcrypt from "bcrypt";
export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await USER.findOne({ email });
    if (!user) {
      return res
        .status(406)
        .json({ success: true, message: "Email or password may incorrect" });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({ success: false, message: "password incorrect" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res
      .status(201)
      .json({ success: true, message: "successfully logined", user, token });
    // }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "error in login controller",
      err: error.message,
    });
  }
};
export const registerController = async (req, res) => {
  console.log("inside register controller");
  const { username, email, password } = req.body;
  try {
    let user = await USER.findOne({ email });
    // console.log(user);
    if (user) {
      return res
        .status(406)
        .json({ success: true, message: "user already exist with this email" });
    }

    user = await USER.create(req.body);
    res
      .status(201)
      .json({ success: true, message: "successfully registered", user });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "error to register user", err: error });
  }
};

export const sendOtpController = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await USER.findOne({ email });
    // console.log(user);
    if (user) {
      return res
        .status(406)
        .json({ success: true, message: "user already exist with this email" });
    }

    const otp = otpGenerate();
    const hashedotp = await bcrypt.hash(otp, 10);
    console.log(otp, hashedotp);
    const data = await OTP.create({
      otp: hashedotp,
      email,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });
    const option = {
      from: `"Findly Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: " Your one time otp successfully sended",
      html: `
           <h3>Your OTP is <b>${otp}</b></h3><p>It expires in 5 minutes.</p>
          `,
    };
    await sendEmail(option);
    console.log(data);
    res.status(201).json({
      success: true,
      message: "otp created and sended to email",
      data,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "error to send otp to email",
      err: error.message,
    });
  }
};

export const verifyOtpController = async (req, res) => {
  const { username, email, password, otp } = req.body;
  try {
    const otpReport = await OTP.findOne({ email });
    console.log(otpReport);
    if (!otpReport) {
      return res.status(401).json({ success: false, message: "otp not found" });
    }
    const verifiedOtp = await bcrypt.compare(otp, otpReport.otp);
    // console.log(otpReport.otp, "****", otp, "*****", verifiedOtp);
    if (!verifiedOtp) {
      return res.status(402).json({ success: false, message: "otp invalid" });
    }

    if (otpReport.expiresAt < Date.now())
      return res.status(400).json({ success: false, message: "otp expired" });

    await OTP.deleteOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await USER.create({
      username,
      email,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ success: true, message: "successfully registered", user });
  } catch (error) {
    console.log(error.message);
    res.status(501).json({
      success: false,
      message: "error to verify and register user",
      err: error.message,
    });
  }
};

export const googleController = async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await USER.findOne({ googleId });
    if (!user) {
      user = await USER.create({
        googleId,
        email,
        provider: "google",
        username: name,
        profilePic: picture,
      });
      console.log("user created");
    }

    console.log(user);
    const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ appToken, user });
  } catch (err) {
    console.log("error in google login : ", err);
    res.status(401).json({ error: "Invalid Google token" });
  }
};

export const updateUserController = async (req, res) => {
  const userId = req.userId;
  const { username, email, profilePic } = req.body;
  const image = req.file ? req.file.filename : profilePic;
  try {
    const updatedUser = await USER.findByIdAndUpdate(
      { _id: userId },
      { username, email, profilePic: image },
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: "successfully updated",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "error to update a user",
      err: error.message,
    });
  }
};
