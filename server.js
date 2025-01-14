import Express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import GoogleAuthRouter from "./router/user/googleAuthRouter.js";
import AuthRegister from "./router/user/AuthRouter.js";
import MovieRouter from "./router/admin/movie/movieRouter.js"
import pg from 'pg';
import { ErrorHandler } from "./middleware/OAuth/error/errorHandler.js";
import { NotFound } from "./middleware/OAuth/error/notFound.js";
import { AuthMiddleware } from "./middleware/OAuth/user/userMiddleware.js";
import { ShouldBeAdmin } from "./middleware/OAuth/admin/AdminMiddleware.js";


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
app.use("/api/admin", MovieRouter);

app.use(NotFound)
app.use(ErrorHandler)

const port = process.env.PORT || 6969;
const startServer = async () => {
  try {
    const database = new Client({
        host: "localhost",
        port: 5432,
        user: "postgres",
        password: process.env.PG_PASSWORD,
        database: "MovieBooking"
    })
    await database.connect();
    console.log("DATABASE Connected to pg")
    app.listen(port, () => {
      console.log(`Server is now running on port ${port}`);
    });
  } catch (err) {
    console.error("Error while connecting to Database", err);
  }
};

startServer();
