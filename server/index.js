import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

/* CONFIGURATIONS*/
// use we can grab the file url, specifically when we use the type: "module"
const __filename = fileURLToPath(import.meta.url);  
const __dirname = path.dirname(__filename);
dotenv.config(); // so we can use .env files
const app = express(); // invoke express application so we can use our middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin'}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors()); // this will invoke our cross origin resource sharing policies
// set the directory of where we keep our assets. In our case it is images, 
// here we store locally, but in a production app we would want to store in 
// an actual storage file directory, cloud storage like s3)
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

