import { StatusCodes } from "http-status-codes";
import { CustomErrorApi } from "./customError.js";


export class InternalServerError extends CustomErrorApi{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
}