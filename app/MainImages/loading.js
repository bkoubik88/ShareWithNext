import React from "react";

export default function Loading() {
  return (
    <div className="mt-52 flex justify-center items-center text-center w-full">
      <div
        className=" w-8 justify-center  h-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      ></div>
    </div>
  );
}
