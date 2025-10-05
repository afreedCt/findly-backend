import express from "express";
import {   googleController, loginController, registerController, sendOtpController, updateUserController, verifyOtpController } from "../controllers/authController.js";
import jwtMiddleware from "../middlewares/jwtMiddleware.js";
import multerMiddleware from "../middlewares/multerMiddleware.js";

const authRouter = express.Router();

authRouter.post('/google',googleController);
authRouter.post("/login", loginController);
authRouter.post("/register", registerController);
authRouter.post("/send-otp", sendOtpController);
authRouter.post("/verify-otp", verifyOtpController);
authRouter.put('/update',jwtMiddleware,multerMiddleware.single('profilePic'),updateUserController)
// authRouter.get('all-users'.jwtMiddleware,allUserController)

export default authRouter;
