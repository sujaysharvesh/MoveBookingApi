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

const port = process.env.PORT || 6969;
const startServer = async () => {
  try {
    const database = new Client({
      host: "localhost",
      port: 5432,
      user: "postgres",
      password: process.env.PG_PASSWORD,
      database: "MovieBooking",
    });
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
