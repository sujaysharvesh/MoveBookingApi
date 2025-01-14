import { StatusCodes } from "http-status-codes";

export const ShouldBeAdmin = async (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not authorized to access this route" });
    }
    next();
  };
  