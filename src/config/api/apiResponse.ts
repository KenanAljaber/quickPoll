import { Request, Response } from "express";
export default class ApiResponse{


    static Error(response:Response,error:any){
        let message=error.message || 'Something went wrong';
        let code=error.statusCode || 500;
        response.status(code).send({success:false,message});
    }

    static Success(response:Response,code:number=200,payload:any){
        response.status(code).send(payload);
    }

}