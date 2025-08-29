import {asyncHandler} from "../utils/AsyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/UserModel.js";
const registerUser = asyncHandler(async (req,res)=>{


        const {username,email,password} = req.body;

        if([username,email,password].some((f)=>
            f?.trim()===""
        )){
            throw new ApiError(400,"All fields are required")
        }

        const exitedUser = await User.findOne({
            $or: [{email},{username}]
        })

        if(exitedUser){
            throw new ApiError(400,"User already Exist");
        }

        const user = await User.create({
            username,
            email,
            password
        })
        
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!createdUser){
            throw new ApiError(500,"somthing went wrong while creating the user")
        }

        return res.status(200).json(
            new ApiResponse(201,createdUser,"UserCreated successfully")
        )
    

})

export {registerUser};