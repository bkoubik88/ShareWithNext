import { NextResponse } from "next/server";
import { mongoConection } from "../../lib/mongoConnection";
import Product from "../model/Product/page";

export async function POST(request) {
  const { filter } = await request.json();

  console.log("FILTER ARRAY: " + filter);
  try {
    await mongoConection();
  } catch (error) {
    console.log(error);
  }

  const products = await Product.find(
    filter && { category: { $in: filter } }
  ).sort({
    createdAt: -1,
  });
  return NextResponse.json({ products });
}
