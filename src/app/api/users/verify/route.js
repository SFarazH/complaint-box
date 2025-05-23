import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../lib/utils";
import User from "../../models/User";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("pookieToken")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "No token, authorization denied" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password"); // Exclude password if needed

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json(
      { message: "Token is not valid" },
      { status: 401 }
    );
  }
}
