import { connectDB } from "../../../../lib/utils";
import { NextResponse } from "next/server";
import User from "../../models/User";
import { verifyToken } from "../../../../lib/verify";

export async function PUT(req) {
  try {
    await connectDB();
    const user = await verifyToken();

    const { shareId } = await req.json();
    if (!shareId) {
      return NextResponse.json({ message: "user required" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        $addToSet: { sharedWith: shareId },
      },
      { $new: true }
    );
    return NextResponse.json({
      message: "shared with user",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating sharedWith:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
