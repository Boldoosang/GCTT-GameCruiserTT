import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { getBackendURL } from "../util/server";
import { getAuthToken, clearToken } from "../util/auth";
import { motion } from "framer-motion";

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
      className="flex justify-between p-2 bg-gray-700 rounded-md mb-2 shadow-lg lg:flex-row flex-col gap-2"
    >
      <p className="font-bold text-slate-200">{wishlistedGame.gameName}</p>
      <div className="flex lg:flex-row flex-col gap-2">
        <NavLink
          to={`/games/${item.gameId}`}
          className="bg-blue-700 text-white py-2 rounded-sm ml-auto w-full text-center p-10"
        >
          Details
        </NavLink>
        <button
          disabled={isUpdating}
          className={`${
            isUpdating ? "bg-gray-500 text-white" : "bg-red-700 text-white"
          }  py-2 rounded-sm ml-auto w-full p-10`}
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
