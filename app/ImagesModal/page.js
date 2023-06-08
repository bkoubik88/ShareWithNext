"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Zoom, Navigation, Pagination } from "swiper";
import { BookmarkIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkFilled } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { like } from "../Redux/userSlice";
import Link from "next/link";

export default function ImagesModal({
  product,
  setShowModal,
  showModal,
  setChooseImages,
}) {
  const dispatch = useDispatch();

  const { nextUser } = useSelector((state) => state.user);

  const saveBookmark = async () => {
    if (!nextUser.bookmarks.includes(product._id)) {
      await fetch(`${process.env.NEXT_PUBLIC_URL}/UpdateBookmarks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, action: "add" }),
      }).then(async () => {
        dispatch(like(product._id));
      });
    } else {
      await fetch(`${process.env.NEXT_PUBLIC_URL}/UpdateBookmarks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, action: "delete" }),
      }).then(async () => {
        dispatch(like(product._id));
      });
    }
  };

  return (
    <>
      <div
        id="staticModal"
        aria-hidden="true"
        className={`${
          showModal ? "inline-flex" : "hidden"
        } fixed top-0 left-0 right-0 z-50  w-[100vw] h-[100vh] py-4 overflow-x-hidden overflow-y-auto md:inset-0   items-center justify-center `}
      >
        <div className="relative w-full h-full ">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 pb-14">
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center line-clamp-1">
                {product?.title}
              </h3>
              <div className="ml-3">
                <XMarkIcon
                  className="h-8 cursor-pointer hover:text-gray-400 dark:text-white"
                  onClick={() => {
                    setChooseImages(null);
                    setShowModal(false);
                  }}
                ></XMarkIcon>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <Swiper
                autoHeight={true}
                zoom={true}
                navigation={true}
                pagination={{
                  type: "progressbar",
                }}
                modules={[Zoom, Navigation, Pagination]}
                className="mySwiper"
              >
                {product?.images?.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="swiper-zoom-container ">
                      <div className="relative lg:h-[600px] lg:w-[600px] w-[400px] h-[400px]">
                        <Image
                          placeholder="blur"
                          blurDataURL={product.blurImage}
                          priority
                          src={image}
                          alt="image"
                          fill
                          style={{ objectFit: "contain" }}
                        ></Image>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="flex justify-end mb-2 mx-2 cursor-pointer ">
              {nextUser?.bookmarks?.includes(product._id) ? (
                <BookmarkFilled
                  className="h-8 w-8 text-yellow-500 hover:scale-110 transition-all duration-200"
                  onClick={saveBookmark}
                ></BookmarkFilled>
              ) : (
                <BookmarkIcon
                  className="h-8  w-8 hover:scale-110 transition-all duration-200"
                  onClick={saveBookmark}
                ></BookmarkIcon>
              )}
            </div>

            <div className="flex items-end justify-end justify-self-end p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600 ">
              <Link
                href={`/ProductInfo/${product._id}`}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                more Info
              </Link>
              <button
                onClick={() => {
                  setChooseImages(null);
                  setShowModal(false);
                }}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
