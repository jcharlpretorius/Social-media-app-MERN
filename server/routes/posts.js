import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js" ;

const router = express.Router();

/* READ */

// grab the userfeed when we are on the homepage
router.get("/", verifyToken, getFeedPosts);
// only want to grab the relevant user's posts
router.get("/:userId/posts", verifyToken, getUserPosts);


/* UPDATE */
// for liking and unliking posts
router.patch("/:id/like", verifyToken, likePost);

export default router;