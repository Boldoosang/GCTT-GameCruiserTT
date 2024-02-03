import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { getBackendURL } from "../util/server";
import { getAuthToken, clearToken } from "../util/auth";
import { motion } from "framer-motion";
import placeholderImage from "../assets/placeholder.png";

export default function WishlistItem({ item, getWishlistState }) {
  const [wishlistedGame, setWishlistedGame] = useState(item);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleUpdateWishlist(gameId, gameName, method) {
    setIsUpdating(() => true);

    try {
      const response = await fetch(`${getBackendURL()}/user/wishlist`, {
        method: method,
        body: JSON.stringify({ gameId, gameName }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
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
      getWishlistState();
      setIsUpdating(() => false);
    }
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: -40 },
        show: { opacity: 1, y: 0 },
      }}
      key={item.gameId}
      className="flex justify-between p-2 bg-gray-900 rounded-md mb-2 shadow-lg lg:flex-row flex-col gap-2"
    >
      <div className="flex flex-row gap-3">
        <img
          src={wishlistedGame.backgroundImage ?? placeholderImage}
          className="object-cover w-[10rem] h-[10rem] rounded-md"
        ></img>
        <p className="font-bold text-slate-200">{wishlistedGame.gameName}</p>
      </div>
      <div className="flex flex-col gap-2">
        <NavLink
          to={`/games/${item.gameId}`}
          className="flex items-center justify-center bg-blue-700 hover:bg-blue-900 text-white rounded-sm ml-auto w-full text-center outline px-10 py-3 flex-grow outline-blue-900 outline-1"
        >
          Details
        </NavLink>
        <button
          disabled={isUpdating}
          className={`${
            isUpdating
              ? "bg-gray-500 text-white"
              : "bg-red-700 hover:bg-red-900 text-white outline-red-900"
          } rounded-sm ml-auto w-full outline outline-1 px-10 py-3 flex-grow`}
          onClick={() =>
            handleUpdateWishlist(wishlistedGame.gameId, item.gameName, "DELETE")
          }
        >
          {isUpdating ? "Updating..." : "Remove"}
        </button>
      </div>
    </motion.div>
  );
}
