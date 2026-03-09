import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error(
		"Missing MONGODB_URI. Configure the same shared MongoDB URI in your environment (local + deployment) so uploaded images/data are visible to all users."
	);
}

type MongooseCache = {
	conn: mongoose.Mongoose | null;
	promise: Promise<mongoose.Mongoose> | null;
};

declare global {
	var mongooseCache: MongooseCache | undefined;
}

const cached = global.mongooseCache || (global.mongooseCache = { conn: null, promise: null });

export async function connectDB() {
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
	}

	cached.conn = await cached.promise;
	return cached.conn;
}

export default connectDB;
