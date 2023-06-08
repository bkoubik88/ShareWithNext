import { NextResponse } from "next/server";
import CurrentUser from "../model/CurrentUser/page";

export async function POST(request) {
  const body = await request.json();

  const findUser = await CurrentUser.findOne({ email: body.email });

  if (!findUser) {
    return NextResponse.json({ text: "User not found" }, { status: 401 });
  }

  const user = await CurrentUser.findOneAndUpdate(
    { email: body.email },
    { ...body },
    { new: true }
  );
  return NextResponse.json({ user }, { status: 200 });
}
