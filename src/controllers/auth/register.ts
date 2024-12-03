import ApiResponse from "../../config/api/apiResponse";
import { Request, Response } from "express";
import ErrorWithMessage from "../../errors/errorWithMessage";
import { IUserRegisterDTO } from "../../database/DTO/IuserDTOs";
import AuthService from "../../service/authService";


export default async (req:any, res:Response) => {
    try {
        const registerDTO:IUserRegisterDTO = req.body;
        console.log(registerDTO);
        
        if (!registerDTO.email || !registerDTO.password || !registerDTO.firstName || !registerDTO.lastName) {
            throw new ErrorWithMessage('Data  are required',400);
        }
        const payload = await new AuthService(req).register(registerDTO);
        return ApiResponse.Success(res,200,{data:payload});
    } catch (error) {
        console.log(error);
        return ApiResponse.Error(res,error);
    }
}