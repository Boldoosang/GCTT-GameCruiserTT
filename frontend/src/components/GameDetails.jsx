import React, { useEffect, useState } from "react";
import { getBackendURL } from "../util/server";
import { getAuthToken } from "../util/auth";
import placeholderImage from "../assets/placeholder.png";

import { DUMMY_DETAILS, DUMMY_GAMES } from "./dummygames";
import { useRouteLoaderData, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./LoadingSpinner";
import ErrorLoader from "./ErrorLoader";

function GameDetails() {
  const params = useParams();
  const userToken = useRouteLoaderData("root");
  const { gameId } = useParams();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState();
  const [isError, setIsError] = useState(false);
  const [gameDetails, setGameDetails] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  async function altgetGameDetails() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DUMMY_DETAILS);
      }, 500);
    });
  }

  async function getGameDetails() {
    setIsError(false);
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games/${params.gameId}?key=2ee668b045ff4d1f89d17d049f7c3689`,
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
      return data;
    } catch (err) {
      setIsError(true);
      throw new Error("An unexpected error occurred.");
    }
  }

  useEffect(() => {
    async function loadGameDetails() {
      setIsLoading(true);

      const gameDet = await getGameDetails();
      setGameDetails(gameDet);

      setIsLoading(false);
    }

    loadGameDetails();
  }, [params.gameId]);

  async function getWishlistItemState() {
    try {
      const response = await fetch(
        `${getBackendURL()}/user/wishlist/${params.gameId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        setIsWishlisted(false);
      }

      const data = await response.json();

      if (data.wishlistItem) {
        setIsWishlisted(true);
        return;
      }

      setIsWishlisted(false);
    } catch (err) {
      setIsWishlisted(false);
    }
  }

  useEffect(() => {
    getWishlistItemState();
  }, [handleUpdateWishlist]);

  async function handleUpdateWishlist(
    gameId,
    gameName,
    background_image,
    method
  ) {
    setIsUpdating(() => true);

    try {
      const response = await fetch(`${getBackendURL()}/user/wishlist`, {
        method: method,
        body: JSON.stringify({
          gameId,
          gameName,
          backgroundImage: background_image,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.status === 422) {
        toast.error("Please login and try again.");
        clearToken();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
    } catch (err) {
      toast.error("Backend offline. Please try again later.");
      console.log(err);
    } finally {
      getWishlistItemState();
      setIsUpdating(() => false);
    }
  }
  useEffect(() => {
    document.title = "GameCruiserTT - Game Details";
  });

  return (
    <div className="container mx-auto my-5 p-5 bg-slate-800/50 rounded-sm shadow-lg outline-1 outline-black outline py-8 text-neutral-300">
      {isLoading && <LoadingSpinner />}
      {isError && <ErrorLoader />}
      {!isLoading && !isError && gameDetails && (
        <>
          <img
            src={
              gameDetails.background_image
                ? gameDetails.background_image
                : placeholderImage
            }
            alt=""
            className="object-cover w-full h-96 rounded-lg shadow-lg"
          />
          <hr className="my-2"></hr>

          {!userToken && (
            <button
              className={`${
                userToken
                  ? " bg-green-700 text-white hover:bg-green-900"
                  : "bg-gray-300 text-black "
              } py-2 rounded-sm ml-auto w-full `}
              disabled={userToken ? false : true}
            >
              Login to Wishlist
            </button>
          )}
          {userToken && (
            <button
              className={`${
                isUpdating
                  ? "bg-gray-500 text-white"
                  : !isWishlisted
                  ? " bg-green-700 text-white hover:bg-green-900"
                  : "bg-red-700 text-white hover:bg-red-900"
              } py-2 rounded-sm ml-auto w-full`}
              disabled={userToken ? false : true}
              onClick={() =>
                handleUpdateWishlist(
                  gameId,
                  gameDetails.name,
                  gameDetails.background_image,
                  `${isWishlisted ? "DELETE" : "POST"}`
                )
              }
            >
              {isUpdating
                ? "Updating..."
                : !isWishlisted
                ? "Add to Wishlist"
                : "Remove from Wishlist"}
            </button>
          )}
          <hr className="my-2"></hr>
          <h1 className="text-3xl font-bold mb-2 text-neutral-100">
            {gameDetails.name}
          </h1>
          <p>{gameDetails.description_raw}</p>
          <div className="mt-3">
            <p>
              <span className="font-bold text-neutral-100">Release Date: </span>
              {gameDetails.released
                ? new Date(gameDetails.released).toDateString()
                : "Not stated"}
            </p>
          </div>
          {gameDetails?.platforms.length > 0 && (
            <div className="mt-3">
              <p>
                <span className="font-bold text-neutral-100">Platforms: </span>
              </p>
              <ul>
                {gameDetails.platforms.map((platform) => {
                  return (
                    <li key={platform.platform.id}>{platform.platform.name}</li>
                  );
                })}
              </ul>
            </div>
          )}
          {gameDetails?.publishers.length > 0 && (
            <div className="mt-3">
              <p>
                <span className="font-bold text-neutral-100">Publishers: </span>
              </p>
              <ul>
                {gameDetails.publishers.map((publisher) => {
                  return <li key={publisher.id}>{publisher.name}</li>;
                })}
              </ul>
            </div>
          )}
          {gameDetails?.tags.length > 0 && (
            <div className="mt-3">
              <p>
                <span className="font-bold text-neutral-100">Tags: </span>
              </p>
              <ul>
                {gameDetails.tags.map((tag) => {
                  return <li key={tag.id}>{tag.name}</li>;
                })}
              </ul>
            </div>
          )}
          {gameDetails?.genres.length > 0 && (
            <div className="mt-3">
              <p>
                <span className="font-bold text-neutral-100">Genres: </span>
              </p>
              <ul>
                {gameDetails.genres.map((genre) => {
                  return <li key={genre.id}>{genre.name}</li>;
                })}
              </ul>
            </div>
          )}
          {gameDetails?.developers.length > 0 && (
            <div className="mt-3">
              <p>
                <span className="font-bold text-neutral-100">Developers: </span>
              </p>
              <ul>
                {gameDetails.developers.map((developers) => {
                  return <li key={developers.id}>{developers.name}</li>;
                })}
              </ul>
            </div>
          )}
          {gameDetails?.esrb_rating && (
            <div className="mt-3">
              <p>
                <span className="font-bold text-neutral-100">Rating: </span>
              </p>
              <h1>{gameDetails.esrb_rating.name}</h1>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default GameDetails;
