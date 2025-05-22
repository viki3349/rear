import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(`${process.env.DB_connection}`);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.log("Error connecting to MONGODB", error.message);
		process.exit(1);
	}
};

export default connectDB;