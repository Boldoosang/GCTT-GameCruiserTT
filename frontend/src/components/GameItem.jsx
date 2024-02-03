import placeholderImage from "../assets/placeholder.png";
import { redirect, useNavigate, useRouteLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import { getBackendURL } from "../util/server";
import { motion } from "framer-motion";

import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { clearToken } from "../util/auth";

function GameItem({ game, isWishlisted, getWishlistState }) {
  const userToken = useRouteLoaderData("root");
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

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
        setIsUpdating(() => false);
        toast.error("Please login and try again.");
        clearToken();
        return redirect("/");
      }

      const data = await response.json();

      if (!response.ok) {
        setIsUpdating(() => false);
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
    } catch (err) {
      toast.error("Backend offline. Please try again later.");
      console.log(err);
    } finally {
      getWishlistState();
      setIsUpdating(() => false);
    }
  }

  return (
    <>
      <motion.div
        variants={{
          hidden: { opacity: 0, x: -40 },
          show: { opacity: 1, x: 0 },
        }}
        className="bg-neutral-800 rounded-md p-2 flex flex-col shadow-lg outline outline-black outline-1"
      >
        <div>
          <img
            src={
              game.background_image ? game.background_image : placeholderImage
            }
            className="shadow-lg rounded-md object-cover w-full lg:h-48 sm:h-70 outline outline-1 outline-black"
          />
        </div>
        <div className="mt-2 mb-auto px-2">
          <p className="font-bold text-neutral-300">{game.name}</p>
        </div>
        <div className="grid auto-cols-auto gap-1 mt-3">
          <button
            className="bg-blue-500 hover:bg-blue-700 rounded-sm p-1 py-2 text-white"
            onClick={() => navigate("/games/" + game.id)}
          >
            Game Details
          </button>

          {!userToken && (
            <button
              className={`${
                userToken
                  ? " bg-green-700 text-white hover:bg-green-900"
                  : "bg-gray-300 text-black "
              } rounded-sm p-1 py-2 `}
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
              } p-1 py-2 rounded-sm`}
              disabled={isUpdating}
              onClick={() =>
                handleUpdateWishlist(
                  game.id,
                  game.name,
                  game.background_image,
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
        </div>
      </motion.div>
    </>
  );
}

export default GameItem;
