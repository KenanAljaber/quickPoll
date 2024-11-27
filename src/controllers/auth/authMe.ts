import ApiResponse from "../../config/api/apiResponse";
import ErrorWithMessage from "../../errors/errorWithMessage";

export default (req:any, res:any) => {
    try {
        if(req.user==null){
            throw new ErrorWithMessage('Unauthorized',401);
        }
        return ApiResponse.Success(res,200,{data:req.user});
    } catch (error:any) {
        // console.log(error);
        
        return ApiResponse.Error(res,error);
    }
}