import ApiResponse from "../../config/api/apiResponse";
import { Request, Response } from "express";
import ErrorWithMessage from "../../errors/errorWithMessage";
import { IUserRegisterDTO } from "../../database/DTO/IuserDTOs";
import UserService from "../../service/userService";


export default async (req:any, res:Response) => {
    try {
        const registerDTO:IUserRegisterDTO = req.body;
        console.log(registerDTO);
        
        if (!registerDTO.email || !registerDTO.hashedPassword || !registerDTO.firstName || !registerDTO.lastName) {
            throw new ErrorWithMessage('Data  are required',400);
        }
        const payload = await new UserService(req).create(registerDTO,req);
        return ApiResponse.Success(res,200,{data:payload});
    } catch (error) {
        console.log(error);
        return ApiResponse.Error(res,error);
    }
}