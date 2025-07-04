import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [8, "Password must be at least 8 characters long"],
		},
		cartData: {
            type:Object,
            default: {}

        },
		role: {
			type: String,
			enum: ["customer", "admin"],
			default: "customer",
		},
			
		
		
	},
	{minimize: false}
);


userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});
userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

const userModel =mongoose.models.user || mongoose.model("usermodel", userSchema);

export default userModel;
