import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/UserModel.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async (userId) => {

    try {

        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateAccessToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };


    } catch (error) {
        throw new ApiError(404, "Sometging went wrong in generating the token")
    }

}

const registerUser = asyncHandler(async (req, res) => {


    const { username, email, password } = req.body;

    if ([username, email, password].some((f) =>
        f?.trim() === ""
    )) {
        throw new ApiError(400, "All fields are required")
    }

    const exitedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (exitedUser) {
        throw new ApiError(400, "User already Exist");
    }

    const user = await User.create({
        username,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "somthing went wrong while creating the user")
    }

    return res.status(200).json(
        new ApiResponse(201, createdUser, "UserCreated successfully")
    )


})



const loginUser = asyncHandler(async (req, res) => {

    const {email, password } = req.body;

    if (!email) {
        throw new ApiError(400, "Please give me the email")
    }

    const user = await User.findOne({email})

    if (!user) {
        throw new ApiError(404, "invalid username and email")
    }

    const isPassword = await user.isPasswordCorrect(password);

    if (!isPassword) {
        throw new ApiError(404, "The password is incorrect");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(400)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser, accessToken, refreshToken
            }, "User Loggedin Secussfully")
        )

})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        },

    },
        {
            new: true
        })

        const options = {
            httpOnly:true,
            secure:true
        }

        return res.status(400)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(
            new ApiResponse(200,{},"User loggedOut Secussfully")
        )

})

const refreshAccessToken = asyncHandler(async (req,res)=>{

    const incomingtoken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingtoken){
        throw new ApiError(404,"Invalid RefreshToken");
    }

    try {

        const decodedToken = jwt.verify(incomingtoken,REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id);

        if(!user){
            throw new ApiError(404,"Invalid Token")
        }

        if(incomingtoken !== user?._id){
            throw new ApiError(404,"Refresh Token is expired")   
        }

        const options = {
            httpOnly: true,
            secure: true
        }

       const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user?._id);

       res.status(200)
       .cookie("refreshToken",newRefreshToken,options)
       .cookie("accessToken",accessToken,options)
       .json(
          new ApiResponse(400,{accessToken,refreshToken:newRefreshToken},"access token Refreshed")
       )


        
    } catch (error) {
        throw new ApiError(404,error?.message || "Invalid Creditiantials")
    }


})

export { registerUser, loginUser, logoutUser ,refreshAccessToken};