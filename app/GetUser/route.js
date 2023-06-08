import CurrentUser from "../model/CurrentUser/page";
import { NextResponse } from "next/server";

import { mongoConection } from "../../lib/mongoConnection";

export async function POST(request) {
  const { user } = await request.json();

  try {
    await mongoConection();
  } catch (error) {
    console.log(error);
  }

  const searchUser = await CurrentUser.findOne({ email: user.email });
  if (!searchUser) {
    const newUser = await CurrentUser.create({
      userId: user.id,
      email: user.email,
      username: user.name,
      profilImage: user.image,
    });
    return NextResponse.json({ user: newUser }, { status: 200 });
  } else {
    const userFound = await CurrentUser.findOne({
      email: user.email,
    });

    return NextResponse.json({ user: userFound }, { status: 200 });
  }
}
