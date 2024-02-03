import React, { useCallback, useEffect, useState } from "react";
import GameItem from "./GameItem";
import { DUMMY_GAMES } from "./dummygames";
import { Link, useLoaderData, useLocation } from "react-router-dom";
import { getBackendURL } from "../util/server";
import { getAuthToken } from "../util/auth";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import PageNumbering from "./PageNumbering";
import PageFlipper from "./PageFlipper";
import LoadingSpinner from "./LoadingSpinner";
import ErrorLoader from "./ErrorLoader";

export default function Games({ searchQuery, page, setPage, ordering }) {
  const [wishlist, setWishlist] = useState([]);
  const [games, setGames] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [totalPages, setTotalPages] = useState(0);

  async function altgetGames() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DUMMY_GAMES);
      }, 1500);
    });
  }

  async function getGames() {
    setIsError(false);
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=2ee668b045ff4d1f89d17d049f7c3689${
          ordering ? "&ordering=released" : ""
        }${page ? "&page=" + page : ""}${
          searchQuery ? "&search=" + searchQuery : ""
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        setIsError(true);
        throw new Error("An unexpected error occurred.");
      }

      const data = await response.json();
      setTotalPages(Math.ceil(data.count / 20));
      return data;
    } catch (err) {
      setIsError(true);
      throw new Error("An unexpected error occurred.");
    }
  }

  useEffect(() => {
    async function loadGames() {
      setIsLoading(true);

      const gamess = await getGames();
      setGames(gamess.results);

      setIsLoading(false);
    }

    loadGames();
  }, [page, searchQuery]);

  async function getWishlistState() {
    try {
      const response = await fetch(`${getBackendURL()}/user/wishlist`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      setWishlist(data.wishlist);
      return data.wishlist;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  useEffect(() => {
    getWishlistState();
  }, []);

  return (
    <div className="container mx-auto flex w-full">
      {isLoading && !isError && <LoadingSpinner />}
      {isError && <ErrorLoader></ErrorLoader>}
      {!isLoading && !isError && games && (
        <div className="flex flex-col w-full">
          {totalPages == 0 && (
            <h1 className="text-2xl font-bold text-center text-gray-100 my-10">
              No results found!
            </h1>
          )}
          {totalPages > 0 && (
            <>
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { type: "spring", staggerChildren: 0.1 },
                  },
                }}
                initial="hidden"
                animate="show"
                className="grid lg:grid-cols-3 sm:grid-cols-1 gap-4 w-full bg-slate-900 p-4 rounded-md shadow-lg outline outline-white outline-1"
              >
                {games.map((game) => {
                  const isWishlisted = wishlist.some(
                    (w) => w.gameId === game.id
                  );
                  return (
                    <GameItem
                      getWishlistState={getWishlistState}
                      key={game.id}
                      game={game}
                      isWishlisted={isWishlisted}
                    />
                  );
                })}
              </motion.div>

              <div className="mt-5">
                <PageFlipper
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                />
                <PageNumbering
                  page={page}
                  totalPages={totalPages}
                  setPage={setPage}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
