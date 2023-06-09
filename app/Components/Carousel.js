"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useKeypress from "react-use-keypress";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import SharedModal from "./ShareModel";

export default function Carousel({ index, currentPhoto }) {
  const router = useRouter();
  const [, setLastViewedPhoto] = useLastViewedPhoto();

  function closeModal() {
    setLastViewedPhoto(currentPhoto._id);
    router.push("/", undefined, { shallow: true });
  }

  function changePhotoId(newVal) {
    return newVal;
  }

  useKeypress("Escape", () => {
    closeModal();
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <button
        className="absolute inset-0 z-30 cursor-default bg-black backdrop-blur-2xl"
        onClick={closeModal}
      >
        <Image
          src={currentPhoto.mainImage}
          className="pointer-events-none h-full w-full"
          alt="blurred background"
          fill
          priority={true}
        />
      </button>
      <SharedModal
        images={currentPhoto.images}
        index={index}
        changePhotoId={changePhotoId}
        currentPhoto={currentPhoto}
        closeModal={closeModal}
        navigation={false}
      />
    </div>
  );
}
