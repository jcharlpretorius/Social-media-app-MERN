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
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

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


/* FILE STORAGE */
// how we can save our files. Whenever someone uploads a file to the website it 
// is saved in public/assets.  From the multer github docs
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
     cb(null, "public/assets");   
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage}); // using this variable whenever we upload a file


/* ROUTES WITH FILES */
//upload picture locally to public/assets folder
// register is a controller. It is the logic at the endpoint
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
// will help us set up routes and keep our file organized
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);


/* MONGOOSE SETUP */
// fix address already in use error
process.once("SIGUSR2", () => server.close(err => process.kill(process.pid, "SIGUSR2"))); 
// backup port 
const PORT = process.env.PORT || 6001; 
// connect to the actual database from the node server
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,  
})
.then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // inject information
    /* ADD ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
})
.catch((error) => console.log(`${error} did not connect`));