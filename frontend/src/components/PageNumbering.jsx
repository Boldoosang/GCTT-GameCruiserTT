import React from "react";
import { Link } from "react-router-dom";

function PageNumbering({ page, setPage, totalPages }) {
  return (
    <div className="w-full">
      <div className="flex gap-2 mx-auto justify-center items-center bg-gray-300/75 outline outline-black outline-1 rounded-sm w-fit py-1 px-6">
        <p className="font-bold">Page: </p>
        <Link
          to={`/games?page=1`}
          className={`${page == 1 ? "text-gray-800" : "text-blue-700"}`}
          disabled={page == 1}
          onClick={() => setPage(1)}
        >
          First
        </Link>
        <p>...</p>
        {page > 2 ? (
          <Link
            to={`/games?page=${page - 2}`}
            onClick={() => setPage(page - 2)}
            className="text-blue-700"
          >
            {page - 2}
          </Link>
        ) : null}
        {page > 1 ? (
          <Link
            to={`/games?page=${page - 1}`}
            onClick={() => setPage(page - 1)}
            className="text-blue-700"
          >
            {page - 1}
          </Link>
        ) : null}
        <Link className={`"text-gray-800" :`} disabled>
          {page}
        </Link>
        {page + 1 <= totalPages ? (
          <Link
            to={`/games?page=${page + 1}`}
            className="text-blue-700"
            disabled
            onClick={() => setPage(page + 1)}
          >
            {page + 1}
          </Link>
        ) : null}
        {page + 2 <= totalPages ? (
          <Link
            to={`/games?page=${page + 2}`}
            className="text-blue-700"
            disabled
            onClick={() => setPage(page + 2)}
          >
            {page + 2}
          </Link>
        ) : null}
        <p>...</p>

        <Link
          to={`/games?page=${totalPages}`}
          className={`${
            page == totalPages ? "text-gray-800" : "text-blue-700"
          }`}
          disabled={page == totalPages}
          onClick={() => setPage(totalPages)}
        >
          Last
        </Link>
      </div>
    </div>
  );
}

export default PageNumbering;
