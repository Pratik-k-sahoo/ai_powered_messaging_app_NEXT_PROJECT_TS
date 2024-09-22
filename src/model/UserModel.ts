import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
	content: string;
	createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
	content: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

export interface User extends Document {
	username: string;
	name: string;
	password: string;
	email: string;
	verifyCode: string;
	verifyCodeExpiry: Date;
	isVerified: boolean;
	isAcceptingMessage: boolean;
	messages: Message[];
}

const userSchema: Schema<User> = new Schema({
	username: {
		type: String,
		required: [true, "Username is required"],
		trim: true,
		unique: true,
	},
	name: {
		type: String,
		required: [true, "Name is required"],
		trim: true,
	},
	password: {
		type: String,
		required: [true, "Password is required"],
		trim: true,
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		trim: true,
		unique: true,
		match: [
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			"Please use a valid email address",
		],
	},
	verifyCode: {
		type: String,
		required: [true, "Verify code is required"],
	},
	verifyCodeExpiry: {
		type: Date,
		required: [true, "Verify code expiry is required"],
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	isAcceptingMessage: {
		type: Boolean,
		required: true,
		default: true,
	},
	messages: [messageSchema],
});

const UserModel =
	(mongoose.models.User as mongoose.Model<User>) ||
	mongoose.model<User>("User", userSchema);

export default UserModel;
