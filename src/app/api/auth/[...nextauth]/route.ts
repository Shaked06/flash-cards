import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { sendEmail } from "@/lib/email";
import EmailProvider from "next-auth/providers/email";

const prisma = new PrismaClient();

if (!process.env.EMAIL_FROM) {
  throw new Error("EMAIL_FROM environment variable is not defined");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60, // 24 hours
      sendVerificationRequest: async ({ identifier: email, url }) => {
        const { success, error } = await sendEmail({
          to: email,
          subject: "Sign in to Flash Cards",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #1a56db; font-size: 24px; margin-bottom: 20px;">Sign in to Flash Cards</h1>
              <p style="font-size: 16px; line-height: 1.5; color: #374151;">
                Click the button below to sign in to your Flash Cards account.
              </p>
              <div style="margin: 30px 0;">
                <a href="${url}" style="background-color: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Sign in
                </a>
              </div>
              <p style="font-size: 14px; color: #6b7280;">
                If you didn't request this email, you can safely ignore it.
              </p>
              <p style="font-size: 14px; color: #6b7280;">
                This link will expire in 24 hours.
              </p>
            </div>
          `,
        });

        if (!success) {
          throw new Error(`Failed to send email: ${error}`);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 