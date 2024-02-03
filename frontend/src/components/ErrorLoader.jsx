import React from "react";

export default function ErrorLoader() {
  return (
    <>
      <div className="my-10 flex flex-col gap-3 w-full mx-auto">
        <svg
          class="h-10 w-10 mx-auto text-red-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          {" "}
          <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />{" "}
          <line x1="15" y1="9" x2="9" y2="15" />{" "}
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>

        <h1 className="text-2xl font-bold text-center text-red-500">
          An unexpected error has occurred!
        </h1>
      </div>
    </>
  );
}
