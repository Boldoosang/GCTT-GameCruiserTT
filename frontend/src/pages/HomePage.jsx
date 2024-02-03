import React, { useEffect, useRef, useState } from "react";
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
  }

  useEffect(() => {
    document.title = "GameCruiserTT - Home";
  });

  return (
    <div className="container mx-auto my-5 p-5 bg-slate-800/50 rounded-sm shadow-lg outline-1 outline-black outline py-8">
      <div className="text-white mb-3">
        <h1 className="text-3xl tracking-widest font-bold text-center text-slate-100 ">
          Welcome to GameCruiserTT!
        </h1>
        <hr className="bg-gray-900 text-gray-900 border-1 my-2"></hr>
        <p className="text-white mb-5">
          The best place to find the latest games, and add them to your
          wishlist!
          <br />
          <br />
          Please use the search bar to find your favorite games or navigate
          using the page numbers below.
          <br />
          <br />
          If you see a game you like, remember to add it to your wishlist for
          safekeeping!
        </p>
        <form onSubmit={handleSearch} className="flex flex-row gap-2">
          <input
            type="text"
            className="w-full p-2 rounded-md bg-slate-100 text-black hover:bg-slate-300 transition"
            placeholder="Search for games..."
            ref={inputSearchQuery}
          />
          <button
            type="submit"
            className="bg-gray-900 text-white p-2 rounded-md px-5 hover:bg-gray-800 transition"
          >
            Search
          </button>
        </form>
        <hr className="bg-gray-900 text-gray-900 border-1 my-2"></hr>
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
