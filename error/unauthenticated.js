import { StatusCodes } from "http-status-codes";
import { CustomErrorApi } from "./customError";


export class UnAuthenticatedError extends CustomErrorApi{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}