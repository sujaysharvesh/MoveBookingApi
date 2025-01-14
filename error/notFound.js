import { StatusCodes } from "http-status-codes";
import { CustomErrorApi } from "./customError";

export class NotFoundError extends CustomErrorApi{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}