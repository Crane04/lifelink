require("express-async-errors");
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./router/index";

require("dotenv").config();
const app = express();

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);

const MONGO_URI = process.env.MONGO_URI;
const port = process.env.PORT;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
    console.error("Error occured while connecting to your database.");
  });

app.use("/api", routes());
