import { NextResponse } from "next/server";
import Comments from "../model/Comments/page";

export async function POST(request) {
  const body = await request.json();
  const comments = await Comments.find({ productId: body.productId });

  return NextResponse.json({ comments }, { status: 200 });
}
