import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) =>  {
  try {
    // grab id from req.params
    const { id } = req.params;
    const user = await user.findBy(id);
    // send back to front end everything relevant to the user
    res.status(200).json(user);
  } catch(err) {
    res.status(404).json({ message: err.message});
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await user.findBy(id)
    
    // going to make multiple api calls to the DB
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    // format it for the frontend. Modifying the schema a bit before sending it back
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        // return an object with the things we just grabbed
        return {_id, firstName, lastName, occupation, location, picturePath};
      }
    );
    res.status(200).json(formattedFriends);
  } catch(err) {
    res.status(404).json({ message: err.message});
  }
};


/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId} = req.params;
    // grab the current user
    const user = await User.findById(id);
    // grab the friend info
    const friend = await User.findById(friendId);
    
    // check if friends id is include in main user's friends 
    if (user.friends.includes(friendId)) {
      // copy same array, except the friend. Remove friend from list 
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    // make sure it is updated
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    // format it for the frontend. Modifying the schema a bit before sending it back
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        // return an object with the things we just grabbed
        return {_id, firstName, lastName, occupation, location, picturePath};
      }
    );

    res.status(200).json({formattedFriends});
  } catch (err) {
    res.status(404).json({ message: err.message});
  }
}