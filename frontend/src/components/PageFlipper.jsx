import React from "react";

function PageFlipper({ page, setPage, totalPages }) {
  return (
    <div className="flex justify-center gap-2 my-5 grid-cols-2 lg:flex-row flex-col mt-3">
      <button
        onClick={() => {
          return page > 1 ? setPage((prev) => prev - 1) : null;
        }}
        disabled={page <= 1}
        className={` text-white w-full py-2  rounded-md ${
          page <= 1 ? "bg-gray-500 " : "bg-slate-900"
        }`}
      >
        Previous Page
      </button>
      <button
        onClick={() => (page < totalPages ? setPage((prev) => prev + 1) : null)}
        disabled={page >= totalPages}
        className={` text-white w-full py-2  rounded-md ${
          page < totalPages ? "bg-blue-500 " : "bg-gray-500"
        }`}
      >
        Next Page
      </button>
    </div>
  );
}

export default PageFlipper;
