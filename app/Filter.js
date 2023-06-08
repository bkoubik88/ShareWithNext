"use client";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Filter({ approveFilter, filter }) {
  const { data: session } = useSession();

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(filter);

  console.log(filter);

  const selectOne = (e) => {
    setShowModal(true);
  };

  const addSelected = (e) => {
    const selectedValue = e.target.value;
    if (selected?.includes(selectedValue)) {
      var index = selected.indexOf(selectedValue);
      if (index !== -1) {
        const copy = [...selected];
        copy.splice(index, 1);
        setSelected(copy);
      }
    } else {
      setSelected((prev) => [...prev, selectedValue]);
    }
  };

  if (session)
    return (
      <>
        <div>
          <FunnelIcon
            className="h-6 cursor-pointer"
            onClick={() => selectOne()}
          ></FunnelIcon>
        </div>

        <div
          id="staticModal"
          aria-hidden="true"
          className={`${
            showModal ? "inline-flex" : "hidden"
          } fixed top-0 left-0 right-0 z-50  w-full py-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full items-center justify-center `}
        >
          <div className="relative w-full max-w-2xl max-h-full ">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 pb-14">
              <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center line-clamp-1">
                  FILTER
                </h3>
                <div className="ml-3">
                  <button onClick={() => setShowModal(false)}>X</button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center mb-4">
                  <input
                    onChange={(e) => addSelected(e)}
                    checked={selected?.includes("Service")}
                    id="serviceId"
                    type="checkbox"
                    value="Service"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  ></input>
                  <label
                    htmlFor="serviceId"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Services
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    onChange={(e) => addSelected(e)}
                    checked={selected?.includes("For sell")}
                    id="sellId"
                    type="checkbox"
                    value="For sell"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  ></input>
                  <label
                    htmlFor="sellId"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    For sell
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    onChange={(e) => {
                      addSelected(e);
                    }}
                    checked={selected?.includes("Give away")}
                    id="awayId"
                    type="checkbox"
                    value="Give away"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  ></input>
                  <label
                    htmlFor="awayId"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Give away
                  </label>
                </div>
              </div>

              <div className="flex items-end justify-end justify-self-end p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600 ">
                <button
                  onClick={() => {
                    approveFilter(selected);
                    setShowModal(false);
                  }}
                  type="button"
                  className="text-white bg-green-400  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 "
                >
                  approve
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  close
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
