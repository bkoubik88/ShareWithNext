import { NextResponse } from "next/server";
import { mongoConection } from "../../lib/mongoConnection";
import Product from "../model/Product/page";

export async function GET() {
  try {
    await mongoConection();
  } catch (error) {
    console.log(error);
  }

  const products = await Product.find({}).sort({
    createdAt: -1,
  });

  return NextResponse.json({ products });
}
