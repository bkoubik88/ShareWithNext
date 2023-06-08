import React from "react";
import Image from "next/image";
import ProductDescription from "../../ProductDescription/page";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import SignIn from "../../SignIn/page";

import "mapbox-gl/dist/mapbox-gl.css";
import MapBoxPlace from "./MapBoxPlace";

const fetchSingle = async ({ productId }) => {
  try {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/SingleProduct?productId=${productId}`
    ).then((res) => res.json());

    return result.product;
  } catch (error) {
    console.log(error);
  }
};

export default async function ProdutInfo({ params }) {
  const session = await getServerSession(authOptions);
  const { productId } = params;

  const pro = await fetchSingle({ productId });

  if (session) {
    return (
      <div className="py-32 dark:bg-gray-900 dark:text-white ">
        <div className="grid grid-cols-1 justify-center text-center items-center ">
          <h1 className="font-semibold text-2xl">{pro.title}</h1>
          <div className="mb-10">
            <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
              {pro.category}
            </span>
          </div>

          <div className="items-center flex justify-center">
            <Image
              blurDataURL={pro.blurImage}
              placeholder="blur"
              style={{ objectFit: "cover" }}
              priority
              src={pro.mainImage}
              alt={pro.title}
              width={1000}
              height={1000}
            ></Image>
          </div>
          <div
            className={`grid mt-2 grid-flow-row-dense grid-cols-4 sm:grid-cols-6 ${
              pro.images.length <= 6 ? "lg:grid-cols-6" : "lg:grid-cols-12"
            } gap-1 mx-2`}
          >
            {pro.images.map((img, index) => (
              <div key={index} className="relative w-full h-16">
                <Image
                  priority
                  alt="image array"
                  src={img}
                  fill
                  style={{ objectFit: "cover" }}
                ></Image>
              </div>
            ))}
          </div>
          {/*
          <div>
            <Carousel currentPhoto={pro} index={pro._id} />
          </div>
            */}
          <div className="mt-6">
            <h1>Description</h1>
            <ProductDescription product={pro.description}></ProductDescription>
          </div>
          <MapBoxPlace product={pro}></MapBoxPlace>
          <div>
            {pro.category === "service" && (
              <div>
                <button>book</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  return <SignIn></SignIn>;
}
