import React from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DropDownMenu from "./DropDownMenu";
import Filter from "../Filter";
export default async function Header() {
  const session = await getServerSession(authOptions);

  if (session) {
    return (
      <header className="hidden lg:flex">
        {session && (
          <div className="dark:bg-blue-950 dark:shadow-cyan-500/20 dark:text-white p-2 shadow-md top-0 z-50 fixed w-full  bg-white">
            <div className="flex flex-row justify-between">
              <div className=" justify-start items-center p-4 cursor-pointer">
                <div className="justify-center items-center">
                  <Link href="/">
                    <HomeIcon className="h-8"></HomeIcon>
                  </Link>
                </div>
              </div>

              <div className="flex flex-row space-x-4 justify-end items-center justify-self-end">
                <>
                  <div className=" items-center text-center  rounded-full p-2 bg-teal-400">
                    <Filter></Filter>
                  </div>
                  <div>
                    <DropDownMenu></DropDownMenu>
                  </div>
                  <div>
                    <Link href="/New">
                      <button className="p-2 text-sm dark:bg-black  bg-sky-400 text-white rounded-md flex flex-row items-center space-x-1 hover:bg-sky-700">
                        <PlusCircleIcon className="h-8"></PlusCircleIcon>
                        <span>Product</span>
                      </button>
                    </Link>
                  </div>
                </>
              </div>
            </div>
          </div>
        )}
      </header>
    );
  }

  return <></>;
}
