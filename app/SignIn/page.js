"use client";
import { signIn } from "next-auth/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/userSlice";

export default function SignIn() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, []);

  return (
    <div className="bg-white mb-10 mt-10 flex items-center justify-center flex-col h-[100vh]">
      <h1 className="text-lg font-semibold text-gray-600">
        You are not sign In
      </h1>
      <hr className="my-5 h-0.5 border-t-0 bg-black opacity-100 dark:opacity-50 w-full"></hr>
      <button
        className="p-4 bg-black text-white rounded-md "
        onClick={() => signIn()}
      >
        sign in
      </button>
    </div>
  );
}
