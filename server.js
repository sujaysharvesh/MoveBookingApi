import Express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import GoogleAuthRouter from "./router/user/googleAuthRouter.js";
import AuthRegister from "./router/user/AuthRouter.js";
import pg from 'pg';

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
app.use("/auth/api", AuthRegister);


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
