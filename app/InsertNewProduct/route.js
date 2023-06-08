import { NextResponse } from "next/server";
import Product from "../model/Product/page";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { mongoConection } from "../../lib/mongoConnection";
import { revalidatePath } from "next/cache";

export async function POST(request) {
  const path = request.nextUrl.searchParams.get("path") || "/";

  const session = await getServerSession(authOptions);
  try {
    await mongoConection();
  } catch (error) {
    console.log(error);
  }

  const body = await request.json();

  if (session) {
    await Product.create({
      userId: session?.user.id,
      title: body.title,
      description: body.description,
      images: body.images,
      lngLat: body.lngLat,
      mainImage: body.mainImage,
      blurImage: body.blurImage,
      category: body.category,
    });

    revalidatePath("/");

    return NextResponse.json({
      revalidate: true,
      now: Date.now(),
    });
  }
}
