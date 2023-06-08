import { NextResponse } from "next/server";
import CurrentUser from "../model/CurrentUser/page";
import { mongoConection } from "../../lib/mongoConnection";

export async function POST(request) {
  const body = await request.json();

  try {
    await mongoConection();
  } catch (error) {
    console.log(error);
  }

  const searchUser = await CurrentUser.findOne({ email: body.email });

  if (!searchUser) {
    const user = await CurrentUser.create({ ...body });

    return NextResponse.json({ user }, { status: 200 });
  } else {
    return NextResponse.json({ user: searchUser }, { status: 200 });
  }
}
