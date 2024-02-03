import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBackendURL } from "../util/server";
import { toast } from "react-toastify";
import { getAuthToken } from "../util/auth";
import WishlistItem from "../components/WishlistItem";
import { motion } from "framer-motion";
import ErrorLoader from "../components/ErrorLoader";
import LoadingSpinner from "../components/LoadingSpinner";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  async function getWishlistState() {
    setIsLoading(true);

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
      return;
    } catch (err) {
      setIsError(true);
      console.log(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getWishlistState();
  }, []);

  useEffect(() => {
    document.title = "GameCruiserTT - Wishlist";
  });

  return (
    <div className="container mx-auto my-5 p-5 bg-slate-800/50 rounded-sm shadow-lg outline-1 outline-black outline py-5">
      <h2 className="text-3xl tracking-widest font-bold text-center text-slate-100 ">
        Wishlist
      </h2>
      <hr className="my-3"></hr>
      {isError ? (
        <ErrorLoader />
      ) : isLoading ? (
        <LoadingSpinner />
      ) : wishlist.length <= 0 ? (
        <h1 className="text-center font-bold text-xl text-neutral-200 my-10">
          No items in wishlist.
        </h1>
      ) : (
        <motion.div
          layout
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          initial="hidden"
          animate="show"
        >
          {wishlist.map((item) => {
            return (
              <WishlistItem
                key={item.gameId}
                item={item}
                wishlist={wishlist}
                getWishlistState={getWishlistState}
              />
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
