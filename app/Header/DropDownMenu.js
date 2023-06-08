"use client";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowLeftIcon,
  BookmarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/userSlice";
import { updateOffer } from "../Redux/offersSlice";
import Link from "next/link";

export default function DropDownMenu() {
  const { nextUser } = useSelector((state) => state.user);

  const [offered, setOffered] = useState([]);

  const [offersNotRead, setOffersNotRead] = useState(0);

  const dispatch = useDispatch();
  const { data: session } = useSession();

  const userLogout = () => {
    dispatch(logout());
    signOut();
  };

  useEffect(() => {
    if (offered.length > 0) {
      dispatch(updateOffer(offered));
      const copy = [...offered];

      const result = copy.filter((offer) => offer.hadRead === false);

      setOffersNotRead(result.length);
    }
  }, [offered]);

  if (session) {
    return (
      <Menu as="div" className="relative inline-block text-left">
        <div className=" mt-2">
          <Menu.Button>
            <div className="relative w-[50px] h-[50px]">
              {nextUser?.profilImage ? (
                <Image
                  priority
                  className="rounded-full"
                  src={nextUser.profilImage}
                  style={{ objectFit: "cover" }}
                  alt="profilImage"
                  fill
                ></Image>
              ) : (
                <UserCircleIcon className="h-12 dark:text-white"></UserCircleIcon>
              )}
              {offered.length > 0 && (
                <div className=" absolute -top-1  -right-1   rounded-full items-center text-center animate-pulse z-50">
                  <h1 className="bg-black text-white rounded-full w-6 h-6 items-center text-center">
                    {offersNotRead}
                  </h1>
                </div>
              )}
            </div>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 text-center">
              <h1 className="text-sm font-thin text-gray-400">
                {nextUser?.email}
              </h1>
            </div>

            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="AllProducts"
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <UserCircleIcon
                        className="mr-2 h-5 w-5 text-violet-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <UserCircleIcon
                        className="mr-2 h-5 w-5 text-violet-400"
                        aria-hidden="true"
                      />
                    )}
                    Products
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="Bookmarks"
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <BookmarkIcon
                        className="mr-2 h-5 w-5 text-violet-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <BookmarkIcon
                        className="mr-2 h-5 w-5 text-violet-400"
                        aria-hidden="true"
                      />
                    )}
                    Bookmarks
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="Profil"
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <UserCircleIcon
                        className="mr-2 h-5 w-5 text-violet-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <UserCircleIcon
                        className="mr-2 h-5 w-5 text-violet-400"
                        aria-hidden="true"
                      />
                    )}
                    Profil
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => userLogout()}
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <ArrowLeftIcon
                        className="mr-2 h-5 w-5 text-violet-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <ArrowLeftIcon
                        className="mr-2 h-5 w-5 text-violet-400"
                        aria-hidden="true"
                      />
                    )}
                    sign Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  }
}
