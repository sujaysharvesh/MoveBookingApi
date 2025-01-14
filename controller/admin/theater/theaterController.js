import prisma from "../../../utils/prisma";
import StatusCodes from "http-status-codes";

export const CreateTheater = async (req, res) => {
    try{

    }
    catch(err){
        res.Status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong", error: err})
    }
}