"use client";
import React, { useEffect, useRef, useState } from "react";
import OfferRequest from "../OfferRequest/page";
import ImagesModal from "../ImagesModal/page";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";

import SignIn from "../SignIn/page";
import { updateUser } from "../Redux/userSlice";
import Photo from "./Photo";
import SingleImage from "./SingleImage";
import { StarIcon } from "@heroicons/react/24/outline";
import Trash from "./Trash";
import Filter from "../Filter";
import { FetchProducts, FilterProducts } from "./actions";
import { updateFilter } from "../Redux/filterSlice";
import moment from "moment";
import "moment/locale/de";
moment.locale("de");

export default function MainImage() {
  const [showModal, setShowModal] = useState(false);
  const [chooseImages, setChooseImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [filter, setFilter] = useState([]);
  const { filters } = useSelector((state) => state.filter);

  const [page, setPage] = useState(0);

  const [result, setResult] = useState([]);

  const dispatch = useDispatch();

  const { data: session, status } = useSession();

  const lastViewedPhotoRef = useRef(null);

  const handleClickOnImageEvent = (product) => {
    setChooseImages(product);
    setShowModal(true);
  };

  const approveFilter = (selectedFilters) => {
    dispatch(updateFilter(selectedFilters));
    if (selectedFilters.length > 0) {
      setFilter(selectedFilters);
      filterProducts(selectedFilters);
    } else {
      setResult([]);
      sessionStorage.removeItem("products");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (lastViewedPhotoRef && lastViewedPhotoRef.current) {
        sessionStorage.removeItem("productId");
        lastViewedPhotoRef?.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }, [1000]);
    clearTimeout();
  }, [lastViewedPhotoRef.current, lastViewedPhotoRef]);

  useEffect(() => {
    if (filters.length > 0) {
      setFilter(filters);

      filterProducts(filters);
    }
  }, []);

  const filterProducts = async (selectedFilters) => {
    setLoadMore(true);

    const fetching = await FilterProducts(selectedFilters);

    setResult(fetching.products);

    setLoadMore(false);
  };

  useEffect(() => {
    if (filters.length === 0) {
      fetchProducts();
    }
  }, [page]);

  const fetchProducts = async () => {
    setLoadMore(true);

    const fetching = await FetchProducts(page);

    setResult((prev) => [...prev, ...fetching.products]);

    sessionStorage.setItem("products", JSON.stringify(result));

    setLoadMore(false);
  };

  useEffect(() => {
    const getUser = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_URL}/GetUser`, {
        method: "POST",
        headers: { "Content-Typ": "application/json" },
        body: JSON.stringify({ user: session.user }),
      }).then(async (res) => {
        const result = await res.json();

        dispatch(updateUser(result.user));
      });
    };

    session?.user && getUser();
  }, [session?.user]);

  if (status === "loading") {
    return (
      <div className="mt-32 text-center bg-white">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );
  }

  if (session) {
    return (
      <>
        <div className="absolute right-20 mt-5 items-center text-center  rounded-full p-2 bg-teal-400">
          {loadMore ? (
            <div
              className=" w-8 justify-center  h-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            ></div>
          ) : (
            <Filter approveFilter={approveFilter} filter={filter}></Filter>
          )}
        </div>
        <div>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pt-16 lg:pt-32  text-center gap-2 px-5 pb-20 ${
              showModal ? "filter blur-sm " : ""
            }`}
          >
            {result.length > 0 &&
              result.map((product, index) => {
                return (
                  <div
                    ref={
                      product._id === sessionStorage.getItem("productId")
                        ? lastViewedPhotoRef
                        : null
                    }
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
                          isLast={index === result.length - 1}
                          newLimit={() => {
                            setPage(page + 6);
                            sessionStorage.setItem(
                              "currentPage",
                              Number(page + 6)
                            );
                          }}
                          product={product}
                          handleClickOnImageEvent={handleClickOnImageEvent}
                        ></SingleImage>
                        {loading && (
                          <div className="flex justify-end items-center text-center mr-2 mt-2">
                            <div
                              className=" w-8 justify-center h-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"
                              role="status"
                            ></div>
                          </div>
                        )}
                        {session?.user?.id === product.userId && (
                          <Trash product={product}></Trash>
                        )}
                        <span className=" absolute font-semibold text-sm bottom-0 px-2 w-full justify-end items-end flex bg-gray-300/80">
                          {moment(product.createdAt).fromNow()}
                        </span>
                        <Photo
                          product={product}
                          handleClickOnImageEvent={handleClickOnImageEvent}
                        ></Photo>
                      </div>
                      {product.category?.toLowerCase() === "service" &&
                        session.user?.id !== product.userId && (
                          <OfferRequest product={product}></OfferRequest>
                        )}
                      {product.rating && (
                        <div className="flex flex-row justify-end w-full">
                          <StarIcon className="h-6 lg:h-8 text-yellow-400"></StarIcon>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        {chooseImages && (
          <ImagesModal
            showModal={showModal}
            setShowModal={setShowModal}
            product={chooseImages}
            setChooseImages={setChooseImages}
          ></ImagesModal>
        )}
      </>
    );
  } else {
    return <SignIn></SignIn>;
  }
}
