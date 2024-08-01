import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';
import { getServerSession } from "next-auth/next"
import { Session } from "next-auth";

interface CustomSession extends Session {
    user: User;
  }

export async function POST(request: Request) {
  await dbConnect();

  const session = (await getServerSession(authOptions)) as CustomSession;
  const user: User = session?.user;
  console.log(user);
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  const userID = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userID,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Unable to find user to update message acceptance status",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error updating message acceptance status:", error);
    return Response.json(
      { success: false, message: "Error updating message acceptance status" },
      { status: 500 }
    );
  }
}

export async function GET(request:Request) {
  const session = (await getServerSession(authOptions)) as CustomSession;
  const user: User = session?.user;
  console.log(user);
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  const userID = user._id;

  try {
   const foundUser = await UserModel.findById(userID);

  if (!foundUser) {
    return Response.json(
      {
        success: false,
        message: "User not found",
      },
      { status: 404 }
    );
  }

  return Response.json(
    {
      success: true,
      isAcceptingMessages: foundUser.isAcceptingMessage,
    },
    { status: 200 }
  );
  } catch (error) {
    console.error("Error in getting message acceptance:", error);
    return Response.json(
      { success: false, message: "Error in getting message acceptance" },
      { status: 500 }
    );
  }
}