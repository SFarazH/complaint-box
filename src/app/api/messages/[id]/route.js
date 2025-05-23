import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/utils";
import Message from "../../models/Message";
import { verifyToken } from "../../../../lib/verify";

export async function DELETE(_, { params }) {
  try {
    await connectDB();
    const user = await verifyToken();

    const deleted = await Message.findOneAndDelete({
      _id: params.id,
      user: user.id,
    });
    if (!deleted) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Message deleted", success: true });
  } catch (err) {
    return NextResponse.json(
      { message: err.message, success: false },
      { status: 500 }
    );
  }
}
