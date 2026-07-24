import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import { dbMock } from "@/lib/db-mock";

export async function POST(req: Request) {
  try {
    const { token: googleCredential } = await req.json();
    
    // Simulate verifying google credential, returning a default google user profile
    const mockGoogleUser = {
      userId: "USR-GOOG-129481",
      name: "Google User",
      email: "google.user@gmail.com",
      role: "customer"
    };

    // Keep registered locally if needed
    const existing = dbMock.findUserByEmail(mockGoogleUser.email);
    if (!existing) {
      dbMock.addUser({
        ...mockGoogleUser,
        password: "google-auth-no-password",
        createdAt: new Date().toISOString()
      });
    }

    const token = signToken(mockGoogleUser);

    const response = NextResponse.json({
      success: true,
      user: mockGoogleUser
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/"
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Google verification failed" }, { status: 400 });
  }
}
