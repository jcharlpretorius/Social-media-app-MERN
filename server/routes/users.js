import express from "express";
import {
  getUser,
  getUserFriends, 
  addRemoveFriend, 
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router()

/* READ ROUTES - the R in CRUD*/
// represent routes where we grab info. Not updating anything in DB

router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
// update function you use patch instead of get
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;