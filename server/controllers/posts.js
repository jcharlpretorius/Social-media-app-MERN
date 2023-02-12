import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    // what the front end sends us
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    })
    // wait to save post in mongoDB
    await newPost.save();

    // grab all the posts
    const post = await Post.find();

    // return all posts to front end os it has list of updated posts
    // so that user feed is updated with the user's post
    res.status(201).json(post);

  } catch (err) {
    res.status(409).json({ message: err.message});
  }
}

/* READ */
// get the posts of everyone. Represent a news feed
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message})
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find(userId);
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message})
  }
}

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const {id } = req.params; // id comes from the query string
    const {userId } = req.body; // userId comes from the body of the request
    const post = await post.findById(id);

    // check post has been liked by that person
    const isLiked = post.likes.gets(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    // update frontend after user clicks like button
    const updatedPost = await Post.findByIdAndUpdate(
      id, 
      { likes: post.likes},
      { new: true} 
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message})
  }
}