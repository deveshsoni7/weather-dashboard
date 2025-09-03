import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";
export const verifyJwt = asyncHandler(async(req,res,next)=>{

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    
        if(!token){
            throw new ApiError("404","unauthorized User")
        }
    
        const decodedInfo  = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedInfo._id).select("-password -refreshToken");
    
        if(!user){
            throw new ApiError(400,"Invalid Access Token")
        }
    
        req.user = user;
    
        next();
    } catch (error) {
        throw new ApiError(404,error ? message : "Invalid Access Token")}
    })
