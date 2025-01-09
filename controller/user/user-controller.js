import bcrypt from "bcryptjs"
import prisma from "../../utils/prisma.js"
import { StatusCodes } from "http-status-codes"
import redis from "../../utils/redis.js";


export const RegisterUser = async (req, res) => {
    try {
      const { username, firstName, lastName, phoneNumber, email, password, confirmPassword, role } = req.body;
  
      if (!username || !email || !password || !confirmPassword) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          message: "All essential information is required.",
        });
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Invalid email format.",
        });
      }
  
      if (password !== confirmPassword) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "Passwords do not match.",
        });
      }
      if (role !== "admin" && role !== "user") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Role must be either 'admin' or 'user'" });
      }
  
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "User already exists.",
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await prisma.user.create({
        data: {
          username,
          firstName,
          lastName,
          phoneNumber,
          email,
          password: hashedPassword,
          role
        },
      });
  
      return res.status(StatusCodes.CREATED).json({
        message: "User created successfully.",
        user: newUser,
      });
    } catch (err) {
      console.error("Error during user registration:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong.",
        error: err.message,
      });
    }
  };
  

export const login = async (req, res) => {
    const { email, password } = req.body;
  
    const user = await prisma.user.findUnique({ where: { email } });
  
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
  
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role, 
    };
  
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    const REDIS_LIFESPAN = 30 * 24 * 60 * 60;
    redis.setex(`auth:${userDetails._id}`, REDIS_LIFESPAN, token);
  
    res.json({ message: 'Login successful',token,});
  };

export const LogOut = async (req, res) => {
    const userId = req.user.userId;
    await redis.del(`auth:${userId}`);
    res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
  };

