import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./dbConfig/dbConfig.js";
import authRouter from "./routes/authRouter.js";
import postRouter from "./routes/postRouter.js";
import claimRouter from "./routes/claimRouter.js";
import messageRouter from "./routes/messageRouter.js";
import donationRouter from "./routes/donationRouter.js";
import adminRouter from "./routes/adminRouter.js";
import reportRouter from "./routes/reportRouter.js";

connectDB();

const app = express();

// use middlewares
app.use(express.json());
app.use("/uploads", express.static("./uploads"));
// app.use(cors());
// const allowedOrigins = [
//   "http://localhost:5173", // for local development
//   "https://findly-frontend.vercel.app/", // for deployed frontend
// ];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: [
      "https://findly-frontend.vercel.app", // your Vercel app URL
      "http://localhost:5173"               // for local testing
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/claim", claimRouter);
app.use("/api/message", messageRouter);
app.use("/api/donation", donationRouter);
app.use("/api/admin", adminRouter);
app.use("/api/report", reportRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server running at ${port}`));
