import { Outlet } from "react-router-dom";
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";

export default function RootLayout() {
  return (
    <div className="bg-slate-600 min-h-screen flex flex-col">
      <ToastContainer />
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
