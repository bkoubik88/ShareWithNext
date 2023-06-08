"use client";
import { TrashIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function DeleteFromPreview({ removePreviewImage, index }) {
  return (
    <TrashIcon
      className="h-8 group-hover:cursor-pointer"
      onClick={() => removePreviewImage(index)}
    ></TrashIcon>
  );
}
