import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';
import { getServerSession } from "next-auth/next"
import { Session } from "next-auth";
import mongoose from 'mongoose';

interface CustomSession extends Session {
    user: User;
}

export async function GET(request:Request) {
  await dbConnect();

  const session = (await getServerSession(authOptions)) as CustomSession;
  const _user: User = session?.user;
  console.log(_user);
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  const userID = new mongoose.Types.ObjectId(_user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userID } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { messages: user[0].messages },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}   