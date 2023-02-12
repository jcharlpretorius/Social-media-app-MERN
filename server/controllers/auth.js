import bcrypt from "bcrypt"; // allows us to encrypt our password
import User from "../models/User.js";
import jwt from "jsonwebtoken"; // give us a way to send a user a web token for authorization

/* REGISTER USER */

/* must be async because we are making a call to mongoDB, which is asynchronous
  req provides us with the req request body we get from the front end, and 
  the response is what we sending back to the front-end. Express has this by default
*/ 
export const register = async (req, res) => {

  /* encrypt the password, save it, then when the user tries to log in we are going
    to salt it and make sure that it is the correct password, then we give them
    a json web token
  */  
  try {
    const {
      firstName, 
      lastName, 
      email,
      password,
      picturePath,
      friends,
      location,
      occupation
    } = req.body; // we are destructuring these elements from the request body

    // create a random salt by bcrypt 
    const salt = await bcrypt.genSalt();
    // use salt to encrypt password
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName, 
      lastName, 
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000), // dummy values
      impressions: Math.floor(Math.random() * 10000) // dummy values
    });
    const savedUser = await newUser.save();
    // res is provided by express
    // send the user a status code of 201 (created)
    res.status(201).json(savedUser);
  } catch(err) {
    res.status(500).json({ error: err.message});
  }
};

/* LOGGING IN */
// companies usally have 3rd party auth, way more secure for production
// basic way ot how authentication works
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // use mongoose to try to find the one that has the specified email
    const user = await User.findOne({ email: email});

    // if the user cannot be found (improper email):
    if (!user) return res.status(400).json({ msg: "User does not exist. "});

    // determine if passwords match. Uses the same salt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. "});

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // delete password so it is safe and not sent back to frontend
    delete user.password;
    res.status(200).json({ token, user});

  } catch (err) {
    res.status(500).json({ error: err.message});
  }
};

