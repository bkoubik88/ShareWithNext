"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRef } from "react";
import { useEffect } from "react";

export default function SingleImage({
  handleClickOnImageEvent,
  product,
  newLimit,
  isLast,
}) {
  const [loading, setLoading] = useState(false);
  const cardRef = useRef();

  useEffect(() => {
    if (!cardRef?.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (isLast && entry.isIntersecting) {
        setLoading(true);
        newLimit();
        observer.unobserve(entry.target);
      }
    });
    setLoading(false);
    observer.observe(cardRef.current);
  }, [isLast]);

  return (
    <>
      <Image
        ref={cardRef}
        className="rounded-md"
        priority
        blurDataURL={product?.blurImage}
        placeholder="blur"
        onClick={() => handleClickOnImageEvent(product)}
        alt={product?.title}
        src={product?.mainImage}
        fill
        style={{ objectFit: "cover" }}
      ></Image>
      {loading && (
        <div className="mt-52 flex justify-center items-center text-center w-full">
          <div
            className=" w-8 justify-center  h-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
        </div>
      )}
    </>
  );
}
