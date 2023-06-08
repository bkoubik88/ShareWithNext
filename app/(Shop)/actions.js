"use server";

import Product from "../model/Product/page";
import { mongoConection } from "../../lib/mongoConnection";

export async function FetchProducts() {
  try {
    await mongoConection();
  } catch (error) {
    console.log(error);
  }

  const products = await Product.find({}).sort({
    createdAt: -1,
  });

  return products;
}
