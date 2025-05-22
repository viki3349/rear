import validator from "validator";
// import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";
// import { redis } from "../config/redis.js";
// import userModel from "../../models/userModel.js";

// Helper function to create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d", // Token expires in 7 days
    });
};

// Helper function to set cookies
const setTokenCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,  // Ensures cookie is not accessible via JS
        secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
        sameSite: 'strict',  // Cookie will be sent only in same-site requests
        maxAge: 7 * 24 * 60 * 60 * 1000,  // Token expires in 7 days
    });
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            const token = createToken(user._id);
            setTokenCookie(res, token);  // Store token in a cookie

            res.json({
                message: "User logged in successfully",
                success: true,
                token,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: error.message });
    }
};

// Register User
const registerUser = async (req, res) => {
    const { email, password, name, role } = req.body;

    try {
        const userExists = await userModel.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Please enter a strong password (minimum 8 characters)" });
        }

        const user = await userModel.create({ name, email, password, role });


        const token = createToken(user._id);
        setTokenCookie(res, token);

        res.status(201).json({
            success: true,
            token,
            message: "User registered successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({ message: error.message });
    }
};





export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: "7d" });

            // Set token in cookies for the admin
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 1 day
            });

            return res.json({ success: true, message: "Admin logged in successfully", token });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};



const logout = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",  // Only in production
            sameSite: "strict",
        });

        res.json({ message: "Logout successful" });
    } catch (error) {
        console.log("Error in logout controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Export necessary functions
export { loginUser, registerUser, logout };
