"use client";
import DOMPurify from "dompurify";
import React from "react";

export default function ProductDescription({ product }) {
  function createMarkup(html) {
    return {
      __html: DOMPurify.sanitize(html),
    };
  }
  return (
    <div
      className="text-center mt-4 items-center flex flex-col"
      dangerouslySetInnerHTML={createMarkup(product)}
    ></div>
  );
}
