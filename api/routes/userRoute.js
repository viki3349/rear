import express from "express";
import {
  registerUser,
  loginUser,
  logout,
  adminLogin,
} from "../controllers/userController.js";
// import { protectRoute } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logout);
userRouter.post("/refresh-token",);
// userRouter.get("/profile", getProfile);
userRouter.post("/admin", adminLogin)



export default userRouter;
