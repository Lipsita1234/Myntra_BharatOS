import { NextResponse } from "next/server";
import { dbMock } from "@/lib/db-mock";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, phone, address } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields (name, email, password, role)" }, { status: 400 });
    }

    const existing = dbMock.findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const newUser = {
      userId: `USR-${Date.now().toString()}`,
      name,
      email,
      password, // In production we would hash this, for hackathon demo we keep it simple
      role: role.toLowerCase(),
      phone: phone || "",
      address: address || "",
      createdAt: new Date().toISOString()
    };

    dbMock.addUser(newUser);

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
