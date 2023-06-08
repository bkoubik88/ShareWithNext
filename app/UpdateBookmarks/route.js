import { getServerSession } from "next-auth";
import CurrentUser from "../model/CurrentUser/page";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  try {
    const body = await request.json();

    if (body.action === "add") {
      const updateBookmarks = await CurrentUser.findOneAndUpdate(
        { email: session.user.email },
        { $push: { bookmarks: body.productId } }
      );

      return NextResponse.json({ updateBookmarks }, { status: 200 });
    } else if (body.action === "delete") {
      const updateBookmarks = await CurrentUser.findOneAndUpdate(
        { email: session.user.email },
        { $pull: { bookmarks: body.productId } }
      );

      return NextResponse.json({ updateBookmarks }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
  }
}
