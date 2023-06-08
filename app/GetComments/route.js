import { NextResponse } from "next/server";
import Comments from "../model/Comments/page";
import { mongoConection } from "../../lib/mongoConnection";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  try {
    try {
      await mongoConection();
    } catch (error) {
      console.log(error);
    }

    const allComments = await Comments.find({
      senderId: { $ne: userId },
    });

    return NextResponse.json({ comments: allComments }, { status: 200 });
  } catch (error) {
    console.log(error);
  }
}
