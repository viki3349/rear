import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  let token = req.headers.authorization || req.headers.token;

  // Extract token from Authorization header if present
  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  if (!token) {
    console.error("Token not found in headers:", req.headers);
    return res.status(401).json({ success: false, message: "Token not found" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", token_decode);
    req.body.userId = token_decode.id; // Attach userId to req.body for further use
    next();
  } catch (error) {
    console.error("Error decoding token:", error.message);
    res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export default authUser;
