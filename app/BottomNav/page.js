"use client";
import React, { useEffect, useState } from "react";
import {
  BookmarkIcon,
  HomeIcon,
  PlusCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { updateOffer } from "../Redux/offersSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BottomNav() {
  const { nextUser } = useSelector((state) => state.user);
  const router = useRouter();
  const [offered, setOffered] = useState([]);
  const [offersNotRead, setOffersNotRead] = useState(0);

  const dispatch = useDispatch();

  const { data: session } = useSession();

  useEffect(() => {
    if (offered?.length > 0) {
      dispatch(updateOffer(offered));
      const copy = [...offered];

      const result = copy.filter((offer) => offer.hadRead === false);

      setOffersNotRead(result.length);
    }
  }, [offered]);

  if (session) {
    return (
      <div className="dark:bg-blue-950 lg:hidden  fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200  dark:border-gray-600">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          <Link
            href={`${process.env.NEXT_PUBLIC_URL}`}
            shallow={true}
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <HomeIcon className="h-8 dark:text-white"></HomeIcon>

            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Home
            </span>
          </Link>
          <Link
            href="/New"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <PlusCircleIcon className="h-8 dark:text-white"></PlusCircleIcon>
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              New
            </span>
          </Link>
          <button
            onClick={() => {
              router.push("Profil", { shallow: true });
            }}
            shallow={true}
            className="relative inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            {nextUser?.profilImage ? (
              <div className="relative w-[35px] h-[35px]">
                <Image
                  priority
                  style={{ objectFit: "cover" }}
                  className="rounded-full"
                  src={nextUser.profilImage}
                  alt="profilImage"
                  fill
                ></Image>
              </div>
            ) : (
              <UserCircleIcon className="h-8 dark:text-white"></UserCircleIcon>
            )}

            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Profil
            </span>
            {offered?.length > 0 && (
              <div className=" absolute top-0 right-4 md:right-8 rounded-full items-center text-center animate-pulse">
                <h1 className="bg-black text-white rounded-full w-6 h-6 items-center text-center">
                  {offersNotRead}
                </h1>
              </div>
            )}
          </button>
          <Link
            href="/Bookmarks"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <BookmarkIcon className="h-8 dark:text-white"></BookmarkIcon>
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
              Fav
            </span>
          </Link>
        </div>
      </div>
    );
  }
  return <></>;
}
