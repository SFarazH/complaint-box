import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/utils";
import Message from "../models/Message";
import { verifyToken } from "../../../lib/verify";

export async function POST(req) {
  try {
    await connectDB();
    const user = await verifyToken();

    const { message } = await req.json();
    if (!message) {
      return NextResponse.json(
        { message: "Message required" },
        { status: 400 }
      );
    }

    await Message.create({
      message,
      user: user.id,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: err.message, success: false },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const user = await verifyToken();

    const messages = await Message.find({ user: user.id }).sort({
      updatedAt: -1,
    });
    return NextResponse.json({ success: true, messages });
  } catch (err) {
    return NextResponse.json(
      { message: err.message, success: false },
      { status: 500 }
    );
  }
}
