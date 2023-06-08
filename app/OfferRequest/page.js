"use client";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

export default function OfferRequest({ product }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSucess] = useState(false);
  const [show, setShow] = useState(false);

  const saveComment = async () => {
    if (message.length > 0) {
      setLoading(true);
      setSucess(false);
      try {
        await fetch(`${process.env.NEXT_PUBLIC_URL}/saveComment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiverId: product.userId,
            text: message,
            productId: product._id,
          }),
        }).then(async () => {
          setShow(true);
          setSucess(true);
          setLoading(false);
          setMessage("");
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 4200);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="flex border flex-row items-center rounded-md mt-3 p-1 w-full">
      <div className="flex-grow  text-left">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Contact offerer"
          className="outline-none p-2  bg-transparent mx-3 w-full"
        ></input>
      </div>
      <div className="bg-cyan-600  p-1 rounded-full hover:bg-cyan-700">
        {loading ? (
          <span>sending...</span>
        ) : (
          <PaperAirplaneIcon
            className="h-8 p-1 text-white"
            onClick={() => saveComment()}
          ></PaperAirplaneIcon>
        )}
      </div>
      {show && (
        <div
          className="p-2 ml-1 text-sm text-center justify-center text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <span className="font-medium">Success!</span>
        </div>
      )}
    </div>
  );
}
