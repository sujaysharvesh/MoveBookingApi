import { StatusCodes } from "http-status-codes"

export const NotFound = (req, res, next) =>{
    res.status(StatusCodes.NOT_FOUND).json("Router Not Found")
}