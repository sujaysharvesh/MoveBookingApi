import { StatusCodes } from "http-status-codes";
import { CustomErrorApi } from "../../../error/customError.js";

export const ErrorHandler = (err, req, res, next) => {
    if (err instanceof CustomErrorApi){
        return res.status(err.statusCode).send(err.message)
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("SomeThing went Wrong")
}
