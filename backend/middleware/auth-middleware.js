import jwt from "jsonwebtoken";
import asyncHandler from "./async-handler.js";
import User from "../models/user-model.js";

// Protect our routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // read our token from the cookies
  // we named this 'jwt' in the user-controller
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorised, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorised, no token");
  }
});

// admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorised as admin");
  }
};

export { admin, protect };
