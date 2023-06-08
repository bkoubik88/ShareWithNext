"use client";
import { TrashIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

export default function Trash({ product }) {
  const [loading, setLoading] = useState(false);

  const removeProduct = async (product) => {
    setLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_URL}/Remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id }),
    }).then(async (res) => {
      setLoading(false);
    });
  };

  return (
    <>
      {loading ? (
        <div className={`absolute top-1 p-2 right-2 bg-gray-800/60 rounded-md`}>
          <div
            className=" w-8 justify-center  h-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
        </div>
      ) : (
        <div
          className={`absolute top-1 p-2 right-2 bg-gray-800/60 rounded-md`}
          onClick={() => removeProduct(product)}
        >
          <TrashIcon className="h-8  text-red-300"></TrashIcon>
        </div>
      )}
    </>
  );
}
