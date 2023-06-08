import React from "react";
import { FetchProducts } from "../actions";
import Photo from "../../MainImages/Photo";
import Trash from "../../MainImages/Trash";
import OfferRequest from "../../OfferRequest/page";
import SingleImage from "../../MainImages/SingleImage";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import moment from "moment";
import "moment/locale/de";
moment.locale("de");

export const revalidate = 10;

export default async function Shop() {
  const products = await FetchProducts();

  const session = await getServerSession(authOptions);
  return (
    <div>
      <h1 className="font-bold text-2xl">Articel</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-5 ">
        {products?.map((product) => (
          <div
            id={product._id}
            key={product._id}
            className="cursor-pointer mt-5"
          >
            <div className="relative col-span-1 flex flex-col justify-center items-center">
              <p className="font-semibold text-2xl text-left w-full line-clamp-1 uppercase mb-1">
                {product.title}
              </p>
              <div
                className="relative w-full h-60 shadow-md"
                data-modal-toggle="staticModal"
                data-modal-target="staticModal"
              >
                <SingleImage
                  product={product}
                  //handleClickOnImageEvent={handleClickOnImageEvent}
                ></SingleImage>

                {session?.user?.id === product.userId && (
                  <Trash product={product}></Trash>
                )}
                <span className=" absolute font-semibold text-sm bottom-0 px-2 w-full justify-end items-end flex bg-gray-300/80">
                  {moment(product.createdAt).fromNow()}
                </span>
                <Photo
                  product={product}
                  //handleClickOnImageEvent={handleClickOnImageEvent}
                ></Photo>
              </div>
              {product.category?.toLowerCase() === "service" &&
                session.user?.id !== product.userId && (
                  <OfferRequest product={product}></OfferRequest>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
