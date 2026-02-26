// Auth service API layer
import User from '@/models/user';

export async function getUserByEmail(email: string) {
	try {
		return await User.findOne({ email }).lean();
	} catch (error) {
		return null;
	}
}
