import {asyncHandler} from "../utils/AsyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res)=>{

    res.status(200).json({
        message:"OK"
    })

})

export {registerUser};