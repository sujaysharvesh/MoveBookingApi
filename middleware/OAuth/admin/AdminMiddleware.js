
export const AdminMiddleware = async (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(StatusCode.FORBIDDEN).json({ message: "You are not authorized to access this route" });
    }
    next();
  };
  