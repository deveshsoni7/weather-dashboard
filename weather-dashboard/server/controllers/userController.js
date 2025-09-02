import {asyncHandler} from "../utils/AsyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/UserModel.js";

const generateAccessAndRefreshToken = async (userId) =>{

    try {
        
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateAccessToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});
        
        return {accessToken,refreshToken};


    } catch (error) {
        throw new ApiError(404,"Sometging went wrong in generating the token")
    }

}

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



const loginUser = asyncHandler(async (req,res)=>{

    const {username,email,password} = req.body;

    if(!username || !email){
        throw new ApiError(400,"Please give me the email or Username")  
    }

    const user = await User.findOne({
        $or:[{email},{username}]
    })

    if(!user){
        throw new ApiError(404,"invalid username and email")
    }

    const isPassword = await user.isPasswordCorrect(password);

    if(!isPassword){
        throw new ApiError(404,"The password is incorrect");
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

})

export {registerUser,loginUser};