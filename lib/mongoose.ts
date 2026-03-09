import mongoose from "mongoose";

const getMongoUri = () => {
	const uri = process.env.MONGODB_URI?.trim();

	if (!uri) {
		throw new Error(
			"Missing MONGODB_URI. Configure the same shared MongoDB URI in your environment (local + deployment) so uploaded images/data are visible to all users."
		);
	}

	return uri;
};

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
		const mongoUri = getMongoUri();
		cached.promise = mongoose.connect(mongoUri, { bufferCommands: false });
	}

	cached.conn = await cached.promise;
	return cached.conn;
}

export default connectDB;
