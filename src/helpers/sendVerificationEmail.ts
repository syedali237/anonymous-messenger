import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { APIResponse } from "@/types/APIResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string 
): Promise<APIResponse> {
  try {
    await resend.emails.send({
        from: 'you@example.com',
        to: email,
        subject: 'Verification Code : Anonymous Message',
        react: VerificationEmail({username: username, otp: verifyCode}),
      });      
    return {
      success: true,
      message: "Verification Email Send Successfully",
    };
  } catch (emailError) {
    console.error("Error Sending Verification Email", emailError);
    return {
      success: false,
      message: "Failed to Send Verification Email",
    };
  }
}