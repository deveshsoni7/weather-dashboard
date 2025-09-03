import express from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/userController.js";
import { verifyJwt } from "../middleware/authMiddleware.js";


const router = express.Router();


router.route("/register").post(registerUser)

router.route("/login").post(loginUser);

//

router.route("/logout").post(verifyJwt,logoutUser);

router.route("/refresh-token").post(refreshAccessToken)

export default router;