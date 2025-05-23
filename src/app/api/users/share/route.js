import { connectDB } from "../../../../lib/utils";
import { NextResponse } from "next/server";
import User from "../../models/User";
import { verifyToken } from "../../../../lib/verify";
import { Types } from "mongoose";

export async function PUT(req) {
  try {
    await connectDB();
    const user = await verifyToken();

    const { shareId } = await req.json();
    if (!shareId) {
      return NextResponse.json({ message: "user required" }, { status: 400 });
    }

    const userDoc = await User.findById(user.id);
    const shareObjectId = new Types.ObjectId(shareId);

    if (userDoc.sharedWith.some((id) => id.equals(shareObjectId))) {
      await User.findByIdAndUpdate(
        user.id,
        { $pull: { sharedWith: shareId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        user.id,
        { $addToSet: { sharedWith: shareId } },
        { new: true }
      );
    }

    return NextResponse.json({
      message: "shared with user",
      success: true,
    });
  } catch (error) {
    console.error("Error updating sharedWith:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
