"use client";
import Image from "next/image";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Resizer from "react-image-file-resizer";
import { storage } from "../../../firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import DeleteFromPreview from "../../DeleteFromPreview/page";
import {
  CheckIcon,
  ChevronUpDownIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { Listbox, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dynamic from "next/dynamic";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import SignIn from "../../SignIn/page";
import draftToHtml from "draftjs-to-html";
mapboxgl.accessToken = `${process.env.NEXT_PUBLIC_MAPBOX}`;

const categorys = [
  { name: "-Choose Category-" },
  { name: "Service" },
  { name: "Give away" },
  { name: "For sell" },
];

const Editor = dynamic(
  async () => {
    const mod = await import("react-draft-wysiwyg");
    return mod.Editor;
  },
  { ssr: false }
);

export default function NewProduct() {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const [preview, setPreview] = useState([]);
  const [previewError, setPreviewError] = useState("");

  const [selected, setSelected] = useState(categorys[0]);
  const [selectedError, setSelectedError] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [count, setCount] = useState(0);
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [success, setSuccess] = useState("");
  const [mainImageSelectes, setMainImageSelected] = useState(0);
  const [wasUploaded, setWasUploaded] = useState(false);
  const [blurImage, setBlurImage] = useState("");
  const [ip, setIp] = useState(null);
  const [markerMap, setMarkerMap] = useState(null);

  const [zoom, setZoom] = useState(10);
  const [convertedContent, setConvertedContent] = useState(null);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const map = useRef(null);

  let promises = [];
  const { data: session } = useSession();

  const mapContainer = useRef();

  useEffect(() => {
    const getIpPlace = async () => {
      const result = await fetch("https://ipapi.co/json/").then((res) =>
        res.json()
      );
      setIp(result);
      setMarkerMap({ longitude: result.longitude, latitude: result.latitude });
    };

    getIpPlace();
  }, []);

  useEffect(() => {
    let html = convertToRaw(editorState.getCurrentContent());

    const blocksFromHtml = draftToHtml(html);

    setConvertedContent(blocksFromHtml);
  }, [editorState]);

  useEffect(() => {
    if (mapContainer?.current && ip?.latitude) {
      if (map.current) return;
      map.current = new mapboxgl.Map({
        container: mapContainer?.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [markerMap?.longitude, markerMap?.latitude],
        zoom: zoom,
      });
      const marker = new mapboxgl.Marker({ draggable: true, scale: 2 });

      const nav = new mapboxgl.NavigationControl({
        visualizePitch: true,
      });
      map.current.addControl(nav, "bottom-right");

      const geocoder = new MapboxGeocoder({
        placeholder: "Search for place",
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
      });
      map.current.addControl(geocoder);

      geocoder.on("result", (event) => {
        let ev = event;
        marker.remove();
        map.current.on("moveend", () => {
          setMarkerMap({
            longitude: ev.result.geometry.coordinates[0],
            latitude: ev.result.geometry.coordinates[1],
          });
        });
        map.current.on("zoomend", () => {
          const currentZoom = map.current.getZoom();
          setZoom(currentZoom);
        });
      });

      function add_marker(event) {
        var coordinates = event.lngLat;
        marker.setLngLat(coordinates).addTo(map.current);
        setMarkerMap({ longitude: coordinates.lng, latitude: coordinates.lat });
      }

      function onDragEnd() {
        const lngLat = marker.getLngLat();
        setMarkerMap({ longitude: lngLat.lng, latitude: lngLat.lat });
      }

      marker.on("dragend", onDragEnd);
      map.current.on("click", add_marker);
    }
  }, [mapContainer?.current, zoom, ip, session]);

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1000,
        1000,
        "JPEG",
        95,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const resizeFileBlur = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        90,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const removePreviewImage = (index) => {
    const copy = [...preview];

    copy.splice(index, 1);
    setPreview(copy);
  };

  useEffect(() => {
    if (preview.length > 16) {
      alert("Max Image length is 16.All Images over 16 will cut out");
      const cutting = [...preview];
      cutting.splice(16, preview.length + 1);
      setPreview(cutting);
    }
  }, [preview]);

  const prepareFiles = async (e) => {
    try {
      const { files } = e.target;

      if (preview.length < 16 && files.length < 16) {
        let array = [];

        if (files) {
          const previewImageBlur = await resizeFileBlur(files[0]);

          setBlurImage(previewImageBlur);

          setCount(files?.length);
          setLoading(true);
          for (let i = 0; i < files?.length; i++) {
            const scaleDown = await resizeFile(files[i]);

            array.push(scaleDown);
          }
        }

        setLoading(false);
        setPreview(preview.concat(array));
      } else {
        alert("Max Image length 16");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const uploadProduct = async () => {
      const mainImage = downloadUrls[mainImageSelectes];

      const saveProduct = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/InsertNewProduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description: convertedContent,
            images: downloadUrls,
            mainImage,
            lngLat: markerMap,
            blurImage: blurImage,
            category: selected.name,
          }),
        }
      );

      const result = await saveProduct.json();

      if (result) {
        setUploading(false);
        setWasUploaded(true);
        setSuccess("Successfully insert");
        setTitle("");
        setDescription("");
        setSelected(categorys[0]);
      }
    };
    downloadUrls.length > 0 && uploadProduct();
  }, [downloadUrls]);

  const verifyFields = () => {
    var descriptionLength = editorState
      .getCurrentContent()
      .getPlainText("").length;

    setSelectedError("");
    setTitleError("");
    setPreviewError("");
    if (selected.name === "-Choose Category-") {
      setSelectedError("You must choose one category");
      return false;
    } else if (title.length < 20) {
      setTitleError("Please fill in a longer title");
      return false;
    } else if (descriptionLength < 30) {
      setDescriptionError(
        "Please give more information about your service/product"
      );
      return false;
    } else if (preview.length < 1) {
      setPreviewError("You must minimum select one image ");
      return false;
    }
    return true;
  };

  const uploadingToFB = async () => {
    if (verifyFields()) {
      setUploading(true);
      try {
        for (let i = 0; i < preview.length; i++) {
          const productRef = ref(storage, `images/${uuidv4()}.jpg`);

          promises.push(
            new Promise(async (resolve, reject) => {
              try {
                uploadString(productRef, preview[i], "data_url").then(
                  (snapshot) => {
                    getDownloadURL(snapshot.ref).then(async (url) => {
                      resolve(url);
                    });
                  }
                );
              } catch (error) {
                reject(error);
              }
            })
          );
        }

        await Promise.all(promises).then((values) => {
          setDownloadUrls(values);
        });
      } catch (error) {
        console.log(error);
        setUploading(false);
      }
    }
  };

  if (session) {
    return (
      <div
        className={`dark:bg-gray-900 dark:text-white pb-32 ${
          preview.length === 0 ? "" : "h-[100%]"
        } `}
      >
        <main>
          <div className="grid grid-cols-1 items-center space-y-2 mx-4 ">
            <div className="md:w-44 z-50 mt-28">
              <Listbox
                value={selected}
                onChange={setSelected}
                disabled={loading}
              >
                <div className="relative mt-1 ">
                  <Listbox.Button className="relative dark:text-black  h-12 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{selected.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {categorys.map((category, categoryIdx) => (
                        <Listbox.Option
                          key={categoryIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={category}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {category.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
              {selectedError && (
                <div className="text-center">
                  <span className="text-red-400 text-lg font-semibold ">
                    {selectedError}
                  </span>
                </div>
              )}
            </div>
            <div className="items-center flex justify-center flex-col">
              <input
                disabled={loading}
                value={title}
                type="text"
                className="p-4 border rounded-md outline-none w-full dark:text-black"
                placeholder="Title"
                onChange={(e) => {
                  title.length < 200 && setTitle(e.target.value);
                }}
              ></input>
              <span className="flex text-end w-full items-end justify-end justify-self-end">
                {title.length} / 200
              </span>
              {titleError && (
                <div className="text-center">
                  <span className="text-red-400 text-lg font-semibold ">
                    {titleError}
                  </span>
                </div>
              )}
            </div>
            <div className="dark:text-black">
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
                toolbar={{
                  options: [
                    "inline",
                    "blockType",
                    "fontSize",
                    "fontFamily",
                    "list",
                    "textAlign",
                    "colorPicker",
                    "remove",
                    "history",
                  ],
                  inline: { inDropdown: true },
                  list: { inDropdown: true },
                  textAlign: { inDropdown: true },
                  link: { inDropdown: true },
                  history: { inDropdown: true },
                }}
              />
              {descriptionError && (
                <div className="text-center">
                  <span className="text-red-400 text-lg font-semibold ">
                    {descriptionError}
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="map-container w-full h-96" ref={mapContainer} />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {loading &&
                Array(count)
                  .fill(undefined)
                  .map((_, index) => (
                    <div
                      key={index}
                      role="status"
                      className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center"
                    >
                      <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                        <PhotoIcon className="h-8"></PhotoIcon>
                      </div>
                    </div>
                  ))}
            </div>
            <div className="flex flex-col justify-center items-center">
              {success !== "" && (
                <h1 className="text-lg text-green-600 font-bold">{success}</h1>
              )}
            </div>

            {previewError && (
              <div className="text-center">
                <span className="text-red-400 text-lg font-semibold ">
                  {previewError}
                </span>
              </div>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 ">
              {preview &&
                !wasUploaded &&
                preview.map((image, index) => (
                  <div
                    className={`w-full h-[200px] relative bg-black ${
                      uploading ? "blur-xl " : ""
                    }`}
                    key={index}
                  >
                    <>
                      <div className="absolute top-2 right-2 bg-slate-500 z-50 rounded-full p-2 text-white group">
                        <DeleteFromPreview
                          removePreviewImage={removePreviewImage}
                          index={index}
                        ></DeleteFromPreview>
                      </div>
                      <Image
                        priority
                        src={image}
                        alt="image"
                        fill
                        style={{ objectFit: "contain" }}
                      ></Image>
                      <div className="absolute flex flex-row bottom-1 right-2 bg-slate-500 z-50 rounded-full p-2 text-white group items-center group">
                        <input
                          disabled={uploading}
                          onClick={() => setMainImageSelected(index)}
                          id={`${index}`}
                          checked={mainImageSelectes === index}
                          type="checkbox"
                          value=""
                          className="group-hover:cursor-pointer w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        ></input>
                        <label
                          htmlFor={`${index}`}
                          className="group-hover:cursor-pointer ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Main Image
                        </label>
                      </div>
                    </>
                  </div>
                ))}
            </div>

            <div className="flex justify-between group pt-4 items-center">
              <div className="p-4 bg-slate-400 rounded-md  text-white  group-hover:text-black ">
                <label htmlFor="upload" className="group-hover:cursor-pointer">
                  {loading ? "Loading..." : "Choose Images"}
                </label>
                <input
                  disabled={loading}
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden h-0 w-0"
                  type="file"
                  id="upload"
                  multiple
                  onChange={prepareFiles}
                ></input>
              </div>

              <div className="justify-self-end">
                {uploading || loading ? (
                  <div className=" flex justify-center items-center text-center mr-2">
                    <div
                      className=" w-8 justify-center   h-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    ></div>
                  </div>
                ) : (
                  <button
                    className="p-4 bg-blue-950 text-white rounded-md hover:bg-blue-200"
                    onClick={uploadingToFB}
                  >
                    save
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } else {
    return <SignIn></SignIn>;
  }
}
