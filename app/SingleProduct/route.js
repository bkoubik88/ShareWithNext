import { mongoConection } from "../../lib/mongoConnection";
import Product from "../model/Product/page";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const productId = searchParams.get("productId");

  try {
    await mongoConection();
  } catch (error) {
    console.log(error);
  }

  const product = await Product.findOne({ _id: productId });
  return NextResponse.json({ product });
}
