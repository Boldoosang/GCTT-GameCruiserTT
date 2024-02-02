import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBackendURL } from "../util/server";
import { toast } from "react-toastify";
import { getAuthToken } from "../util/auth";
import WishlistItem from "../components/WishlistItem";
import { motion } from "framer-motion";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      console.log(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getWishlistState();
  }, []);

  return (
    <div className="container mx-auto my-5 p-3 bg-slate-200/50 rounded-lg ">
      <h2 className="text-3xl font-bold text-center">Wishlist</h2>
      <hr className="my-3"></hr>
      {isLoading ? (
        <h1 className="text-center font-bold text-xl">Loading...</h1>
      ) : wishlist.length <= 0 ? (
        <h1 className="text-center font-bold text-xl">No items in wishlist.</h1>
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
