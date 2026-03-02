import mongoose from "mongoose";

const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost:27017/food_ordering";

type MongooseCache = {
	conn: mongoose.Mongoose | null;
	promise: Promise<mongoose.Mongoose> | null;
};

declare global {
	// eslint-disable-next-line no-var
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
