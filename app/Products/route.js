import { NextResponse } from "next/server";
import { mongoConection } from "../../lib/mongoConnection";
import Product from "../model/Product/page";

export async function POST(request) {
  const body = await request.json();

  try {
    await mongoConection();
  } catch (error) {
    console.log(error);
  }

  const products = await Product.find({})
    .sort({
      createdAt: -1,
      _id: -1,
    })
    .skip(body.page)
    .limit(6);

  console.log("SKIP " + body.page);

  return NextResponse.json({ products });
}
