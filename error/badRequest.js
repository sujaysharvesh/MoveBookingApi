import { CustomErrorApi } from "./customError.js";
import { StatusCodes } from "http-status-codes";

export class BadRequrestError extends CustomErrorApi{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}