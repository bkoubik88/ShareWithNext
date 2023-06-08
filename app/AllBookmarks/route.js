import { NextResponse } from "next/server";
import Product from "../model/Product/page";
import CurrentUser from "../model/CurrentUser/page";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const getUser = async () => {
  const session = await getServerSession(authOptions);

  console.log(JSON.stringify(session));
  const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/GetUser`, {
    method: "POST",
    headers: { "Content-Typ": "application/json" },
    body: JSON.stringify({ user: session.user }),
  });

  const user_ = await result.json();

  return user_;
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userMail = searchParams.get("userMail");

  const userWithBookmarks = await getUser();

  try {
    const list = await Promise.all(
      userWithBookmarks.user.bookmarks.map(async (productId) => {
        const product = await Product.findOne({
          _id: productId,
          createdAt: { $ne: null },
        });
        if (product) {
          return product;
        } else {
          await CurrentUser.updateOne(
            { email: userMail },
            { $pull: { bookmarks: productId } }
          );
        }
      })
    );

    return NextResponse.json(
      list.flat().sort((a, b) => b.createdAt - a.createdAt)
    );
  } catch (error) {
    console.log(error);
  }
}
