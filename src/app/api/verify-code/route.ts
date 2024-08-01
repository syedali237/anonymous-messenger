import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { verifySchema } from '@/schemas/verifySchema'

export async function POST(request:Request) {
  await dbConnect();

  try {
    const requestBody = await request.json();
    
    // Validate the request body
    const result = verifySchema.safeParse(requestBody);

    if (!result.success) {
      console.log(result.error);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid code parameter",
        }),
        { status: 400 }
      );
    }

    // Extract the validated code
    const { code } = result.data;
    // Retrieve the user (assuming username is provided elsewhere)
    const { username } = requestBody; // Make sure `username` is passed in the JSON body

    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Error Verifing User",
        },
        {
          status: 500,
        }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account Verified Successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification Code Expired, Please Sign Up to get a new onw",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect Code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error Verifing User", error);
    return Response.json(
      {
        success: false,
        message: "Error Verifing User",
      },
      {
        status: 500,
      }
    );
  }
}