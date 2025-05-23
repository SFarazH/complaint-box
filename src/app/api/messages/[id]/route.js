import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/utils";
import Message from "../../models/Message";
import { verifyToken } from "../../../../lib/verify";
import User from "../../models/User";

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

export async function GET() {
  try {
    await connectDB();
    const loggedInUser = await verifyToken();

    const usersWhoSharedWithMe = await User.find({
      sharedWith: loggedInUser.id,
    }).select("_id name");

    const allowedUserIds = usersWhoSharedWithMe.map((u) => u._id);
    const pipeline = [
      {
        $match: {
          user: { $in: allowedUserIds },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          message: 1,
          createdAt: 1,
          "user.name": 1,
        },
      },
    ];
    const messages = await Message.aggregate(pipeline);

    return NextResponse.json({ messages: messages, success: true });
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
}
