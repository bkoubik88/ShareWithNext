"use client";
import Image from "next/image";
import React, { useState } from "react";

import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useSession } from "next-auth/react";
import Resizer from "react-image-file-resizer";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { updateUser } from "../Redux/userSlice";
import { useSelector } from "react-redux";

export default function Profil() {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { data: session } = useSession();

  const { nextUser } = useSelector((state) => state.user);

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        200,
        200,
        "JPEG",
        95,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const setNewProfilImage = async (e) => {
    try {
      const { files } = e.target;

      if (files[0]) {
        const file = await resizeFile(files[0]);

        setPreview(file);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadToFB = () => {
    const storageRef = ref(storage, "/profil/" + session?.user?.email);

    if (preview) {
      setLoading(true);

      uploadString(storageRef, preview, "data_url").then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          await fetch(`${process.env.NEXT_PUBLIC_URL}/UpdateUser`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: session.user.email,
              profilImage: url,
            }),
          }).then(async (res) => {
            let result = await res.json();

            dispatch(updateUser(result.user));

            setLoading(false);
          });
        });
      });
    }
  };

  if (session && nextUser) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 dark:text-white dark:bg-gray-900 h-[100vh]">
        <>
          <h1 className="text-sm font-thin text-gray-400">
            {session.user.email}
          </h1>
          <h1 className="text-md font-semibold">Change your Profil Image</h1>

          <div className="relative w-52 h-52 justify-center items-center flex">
            <label htmlFor="profilImg">
              {nextUser?.profilImage || preview ? (
                <Image
                  className="rounded-full"
                  priority
                  alt="actuallyProfilImage"
                  fill
                  style={{ objectFit: "cover" }}
                  src={preview ? preview : nextUser.profilImage}
                ></Image>
              ) : (
                <UserCircleIcon className="h-36"></UserCircleIcon>
              )}
            </label>
          </div>
          <div>
            <input
              type="file"
              id="profilImg"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden h-0 w-0"
              onChange={setNewProfilImage}
            ></input>
          </div>
          <div>
            {preview ? (
              loading ? (
                <h1>uploading...</h1>
              ) : (
                <button
                  className="p-4 border rounded-md hover:bg-black"
                  onClick={uploadToFB}
                >
                  approve
                </button>
              )
            ) : (
              <></>
            )}
          </div>
        </>
      </div>
    );
  }
}
