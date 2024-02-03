import { Outlet } from "react-router-dom";
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";

export default function RootLayout() {
  return (
    <div className="bg-slate-700 min-h-screen flex flex-col">
      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        closeOnClick={true}
        autoClose={1500}
        theme="dark"
        position="bottom-right"
      />
      <Header />

      <main className="px-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
