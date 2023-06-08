"use client";
import { BookmarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { like } from "../Redux/userSlice";
import { useSession } from "next-auth/react";
import SignIn from "../SignIn/page";

export default function Bookmarks() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { data: session } = useSession();

  const fetchBookmarks = async () => {
    setLoading(true);
    await fetch(
      `${process.env.NEXT_PUBLIC_URL}/AllBookmarks?userMail=${session.user.email}`
    ).then(async (res) => {
      let result = await res.json();

      setProducts(result);
      setLoading(false);
    });
  };

  const deleteBookmark = async (productId) => {
    await fetch(`${process.env.NEXT_PUBLIC_URL}/UpdateBookmarks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: productId, action: "delete" }),
    }).then(async () => {
      dispatch(like(productId));
      fetchBookmarks();
    });
  };

  useEffect(() => {
    if (session) {
      fetchBookmarks();
    }
  }, [session]);

  if (session) {
    return (
      <div className=" dark:bg-gray-900 dark:text-white py-28 md:py-40">
        {loading && (
          <div className="flex justify-center">
            <h1 className="text-lg font-thin">Loading Bookmarks...</h1>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 items-center lg:px-6 px-1">
          {products &&
            !loading &&
            products?.map((product) => (
              <div key={product?._id}>
                <div
                  className="relative w-full h-60 shadow-md"
                  data-modal-toggle="staticModal"
                  data-modal-target="staticModal"
                >
                  <Image
                    className="rounded-md"
                    alt={product?.title}
                    src={product?.mainImage}
                    fill
                    priority
                    style={{ objectFit: "cover" }}
                  ></Image>
                  <div className="absolute right-1 top-1 text-yellow-400 cursor-pointer">
                    <BookmarkIcon
                      className="h-8"
                      onClick={() => deleteBookmark(product._id)}
                    ></BookmarkIcon>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
  return <SignIn></SignIn>;
}
