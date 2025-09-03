import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";


const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
app.use(cookieParser())

import userRouter from "./routes/UserRoutes.js";


app.use("/api/v1/users",userRouter);


const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
