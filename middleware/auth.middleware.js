import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";


export const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.token; 

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1]; // Extract from Bearer
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized, please log in again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    if (decoded.role && decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Access denied - Admin only" });
    }
    

    next(); // Proceed
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Unauthorized: " + error.message });
  }
};



export const protectAdminRoute = (req, res, next) => {
  if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Access denied - Admin only" });
  }
  next(); // Proceed to the next middleware or route handler
};
