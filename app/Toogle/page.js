"use client";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateDarkMode } from "../Redux/darkModeSlice";
import SignIn from "../SignIn/page";

export default function Toogle() {
  const [theme, setThemen] = useState("");
  const { data: session, status } = useSession();

  const { darkMode } = useSelector((state) => state.mode);

  const { nextUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
      setThemen(darkMode);
    } else {
      document.documentElement.classList.remove("dark");
      setThemen(darkMode);
    }
  }, [darkMode]);

  const switchMode = () => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      dispatch(updateDarkMode("light"));
    } else {
      document.documentElement.classList.remove("dark");
      dispatch(updateDarkMode("dark"));
    }
  };

  const userLogout = () => {
    signOut();
  };

  if (status === "loading") {
    return (
      <div
        className="ml-4 mt-4 w-8 justify-center  h-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      ></div>
    );
  }

  if (session && status === "authenticated") {
    return (
      <div>
        <div className="lg:hidden absolute m-5 flex space-x-6">
          <button
            className=" p-2 border  rounded-md dark:text-white"
            onClick={() => userLogout()}
          >
            Sign Out
          </button>
        </div>

        <div className="cursor-pointer absolute shadow-md  right-4 top-0 lg:right-4 lg:top-2 lg:mt-20 mt-5 p-2 bg-cyan-400 w-10 h-10 flex justify-center items-center text-center rounded-full">
          {theme === "dark" ? (
            <SunIcon className="h-8 w-8" onClick={switchMode}></SunIcon>
          ) : (
            <MoonIcon className="h-8  w-8" onClick={switchMode}></MoonIcon>
          )}
        </div>
      </div>
    );
  } else {
    return <SignIn></SignIn>;
  }
}
