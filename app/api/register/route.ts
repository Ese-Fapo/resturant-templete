import  User  from "@/models/user";
import mongoose from "mongoose";

export async function POST(request: Request) {

        const body = await request.json();
       mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/food_ordering");

        const createdUser = await User.create(body);
        return Response.json(createdUser);
       
}