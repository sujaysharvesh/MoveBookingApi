import StatusCode from "http-status-codes"
import JWT from "jsonwebtoken";
import redis from "../../../utils/redis.js";

export const AuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCode.FORBIDDEN)
        .json({ message: "Invalid Authentication" });
    }

    const token = authHeader.split(" ")[1];
  
    try {
      const payload = JWT.verify(token, process.env.JWT_SECRET);
      const redisToken = await redis.get(`auth:${payload.userId}`);
      if (!redisToken || redisToken !== token) {
        return res
          .status(StatusCode.FORBIDDEN)
          .json({ message: "Invalid or Expired Token" });
      }
      req.user = { userId: payload.userID, username: payload.username, role: payload.role };
      next(); 
    } catch (err) {
      return res
        .status(StatusCode.FORBIDDEN)
        .json({ message: "Invalid Authentication", error: err.message });
    }
  };
  

