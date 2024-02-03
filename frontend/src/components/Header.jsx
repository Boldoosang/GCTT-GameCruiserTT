import React from "react";
import { BsFillHouseFill } from "react-icons/bs";
import { NavLink, useRouteLoaderData } from "react-router-dom";
import { clearToken } from "../util/auth";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
export default function Header() {
  const userToken = useRouteLoaderData("root");
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  function handleToggleNav() {
    setIsMenuOpen((prevState) => !prevState);
  }

  function handleLogout() {
    clearToken();
    window.location.reload();
  }

  return (
    <motion.header className="bg-slate-800 shadow-lg">
      <nav className="container mx-auto py-6 flex flex-wrap items-center justify-between px-2">
        <NavLink
          className="font-bold text-3xl tracking-wider text-gray-200 hover:text-gray-500 transition flex-row flex items-center gap-3"
          to="/games?page=1"
        >
          <motion.img
            src={logo}
            className="w-full h-16"
            variants={{
              hidden: { opacity: 0, scale: 0.5 },
              show: { opacity: 1, scale: 1 },
            }}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5 }}
          />
          GameCruiserTT
        </NavLink>

        <button
          onClick={handleToggleNav}
          className="lg:hidden text-white outline p-4 rounded-lg ml-auto"
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>

        <div
          className={`lg:flex items-center ${
            isMenuOpen ? "flex" : "hidden"
          } w-full lg:w-auto`}
        >
          <div className="ml-auto w-full flex flex-col lg:flex-row lg:gap-3 text-slate-300 transition">
            <NavLink
              className={({ isActive, isPending }) => {
                return `${
                  isActive ? "text-yellow-300" : "text-slate-300"
                } mx-auto lg:inline-block lg:mt-0 my-2 hover:text-slate-500 transition`;
              }}
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              className={({ isActive, isPending }) => {
                return `${
                  isActive ? "text-yellow-300" : "text-slate-300"
                } mx-auto lg:inline-block lg:mt-0 my-2 hover:text-slate-500 transition`;
              }}
              to="/wishlist"
            >
              Wishlist
            </NavLink>
            {!userToken ? (
              <>
                <NavLink
                  className={({ isActive, isPending }) => {
                    return `${
                      isActive ? "text-yellow-300" : "text-slate-300"
                    } mx-auto lg:inline-block lg:mt-0 my-2 hover:text-slate-500 transition`;
                  }}
                  to="/login"
                >
                  Login
                </NavLink>
                <NavLink
                  className={({ isActive, isPending }) => {
                    return `${
                      isActive ? "text-yellow-300" : "text-slate-300"
                    } mx-auto lg:inline-block lg:mt-0 my-2 hover:text-slate-500 transition`;
                  }}
                  to="/sign-up"
                >
                  Sign Up
                </NavLink>
              </>
            ) : (
              <NavLink
                className="mx-auto lg:inline-block lg:mt-0 my-2 text-slate-300 hover:text-slate-500 transition"
                onClick={handleLogout}
              >
                Logout
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
