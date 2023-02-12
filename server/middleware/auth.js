import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  try {
    // from the front end we are grabbing the auth header, and using it on backend 
    let token = req.header("Authorization")

    if (!token) {
      return res.status(403).send("Access denied");
    }

    // we want token to be starting with bearer?
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}