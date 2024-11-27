import ApiResponse from "../../config/api/apiResponse";
import { Request, Response } from "express";
import ErrorWithMessage from "../../errors/errorWithMessage";
import { IUserLoginDTO } from "../../database/DTO/IuserDTOs";
import AuthService from "../../service/authService";

export default async (req:any, res:Response) => {
    try {
        const login:IUserLoginDTO = req.body;

        if (!login.email || !login.password) {
            throw new ErrorWithMessage('Credentials are required',400);
        }
        const payload =await new AuthService(req).login(login);
        return ApiResponse.Success(res,200,{data:payload});
    } catch (error:any) {
        return ApiResponse.Error(res,error);
    }
}