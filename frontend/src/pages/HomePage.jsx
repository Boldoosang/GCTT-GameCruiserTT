import React, { useRef, useState } from "react";
import Games from "../components/Games";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";

export default function HomePage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initPage = queryParams.get("page");
  const initSearch = queryParams.get("search");
  const inputSearchQuery = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initSearch ? initSearch : "");
  const [page, setPage] = useState(initPage ? parseInt(initPage) : 1);
  const [ordering, setOrdering] = useState(true);

  function handleSearch(event) {
    event.preventDefault();
    setSearchQuery(inputSearchQuery.current.value);
    setSearchParams({ search: inputSearchQuery.current.value, page: 1 });
    if (inputSearchQuery.current.value === "") {
      setOrdering(true);
    } else {
      setOrdering(false);
    }
    setPage(1);

    console.log(searchQuery);
  }
  return (
    <div className="container mx-auto my-5 p-3 bg-slate-200/50 rounded-lg ">
      <div className="text-white mb-3">
        <h1 className="text-3xl tracking-wider font-bold text-center text-slate-800 drop-shadow-md">
          Welcome to GameCruiserTT
        </h1>
        <hr className="bg-gray-900 text-gray-900 border-1 my-2"></hr>
        <form onSubmit={handleSearch} className="flex flex-row gap-2">
          <input
            type="text"
            className="w-full p-2 rounded-md bg-slate-100/50 text-gray-900"
            placeholder="Search for games..."
            ref={inputSearchQuery}
          />
          <button
            type="submit"
            className="bg-gray-900 text-white p-2 rounded-md"
          >
            Search
          </button>
        </form>
        <hr className="bg-gray-900 text-gray-900 border-1 my-2"></hr>
        <p className="text-gray-900 mb-5">
          The best place to find the latest games, and add them to your
          wishlist!
        </p>
      </div>
      <Games
        searchQuery={searchQuery}
        page={page}
        setPage={setPage}
        ordering={ordering}
      />
    </div>
  );
}
