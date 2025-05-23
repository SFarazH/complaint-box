import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/utils";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
4;

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    const response = NextResponse.json({
      message: "Login successful",
      username: user.username,
      userId: user._id,
    });

    response.cookies.set("pookieToken", token, {
      httpOnly: true,
      secure: false, //TODO: add prod check
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
