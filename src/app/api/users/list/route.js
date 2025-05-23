import { connectDB } from "../../../../lib/utils";
import { NextResponse } from "next/server";
import User from "../../models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).select("-password -__v");

    return NextResponse.json({ users: users, success: true }, { status: 200 });
  } catch (err) {}
  return NextResponse.json({ message: err.message }, { status: 500 });
}
