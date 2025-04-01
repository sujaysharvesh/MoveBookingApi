import Express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import GoogleAuthRouter from "./router/user/googleAuthRouter.js";
import AuthRegister from "./router/user/AuthRouter.js";
import MovieRouter from "./router/admin/movie/movieRouter.js";
import TheaterRouter from "./router/admin/theater/theaterRouter.js";
import CityRouter from "./router/admin/city/cityRouter.js";
import ScreenRouter from "./router/admin/theater/screenRouter.js";
import SeatRouter from "./router/admin/theater/seatRouter.js";
import ScreeningRouter from "./router/admin/theater/screeningRouter.js";
import SeatPriceRouter from "./router/admin/theater/seatPriceRouter.js";
import pg from "pg";
import { ErrorHandler } from "./middleware/OAuth/error/errorHandler.js";
import { NotFound } from "./middleware/OAuth/error/notFound.js";
import { AuthMiddleware } from "./middleware/OAuth/user/userMiddleware.js";
import { ShouldBeAdmin } from "./middleware/OAuth/admin/AdminMiddleware.js";
import UserTheaterRouter from "./router/user/theater/userTheaterRouter.js";
import BookingRouter from "./router/user/booking/BookingRouter.js"
import PaymentRouter from  "./router/user/booking/paymentRouter.js"
import TicketRouter from "./router/user/booking/ticketRouter.js"
import ReviewRouter from "./router/user/review/reviewRouter.js"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
import pkg from "pg-connection-string";
const { parse } = pkg;



const { Client } = pg;

dotenv.config();
const app = Express();

app.use(Express.json());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Movie Booking API",
    version: "1.0.0",
    description: "API Documentation for Movie Booking",
  },
  servers: [
    {
      url: "http://localhost:8000", // Change if different
    },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ["./router/**/*.js"], // Path to the directory where your API routes are defined
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/api/test", (req, res) => {
  try {
    console.log("Hello world");
    res.status(200).json({ message: "Test route working" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.use("/auth", GoogleAuthRouter);
app.use("/api/auth", AuthRegister);
app.use(
  "/api/admin",
  ShouldBeAdmin,
  MovieRouter,
  CityRouter,
  TheaterRouter,
  ScreenRouter,
  SeatRouter,
  ScreeningRouter,
  SeatPriceRouter
);
app.use("/api/user", AuthMiddleware, UserTheaterRouter, BookingRouter, PaymentRouter, TicketRouter, ReviewRouter )


app.use(NotFound);
app.use(ErrorHandler);

// Parse connection string and add SSL
const connectionString = process.env.DATABASE_URL;
const dbConfig = parse(connectionString);
dbConfig.ssl = { rejectUnauthorized: false }; // SSL must be set here

const database = new Client(dbConfig);

const port = process.env.PORT || 6969;

const startServer = async () => {
  try {
    await database.connect();
    console.log("DATABASE Connected to pg");
    app.listen(port, () => {
      console.log(`Server is now running on port ${port}`);
    });
  } catch (err) {
    console.error("Error while connecting to Database", err);
  }
};

startServer();
