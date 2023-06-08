"use client";
import { PhotoIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function Photo({ product, handleClickOnImageEvent }) {
  return (
    <div
      className="absolute top-1 p-2 left-2 flex flex-row space-x-6 bg-gray-800/60 rounded-md"
      onClick={() => handleClickOnImageEvent(product)}
    >
      <div>
        <PhotoIcon className="h-8  text-cyan-500"></PhotoIcon>
        <span className="absolute top-0 right-0 h-5 w-5 bg-cyan-400 text-sm font-bold text-black  text-center rounded-full">
          {product.images.length}
        </span>
      </div>
    </div>
  );
}
