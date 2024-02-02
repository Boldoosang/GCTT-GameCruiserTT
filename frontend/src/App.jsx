import { useState, Suspense } from "react";
import HomePage from "./pages/HomePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import WishlistPage from "./pages/WishlistPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import GameDetails from "./components/GameDetails";
import { tokenLoader, checkAuthLoader } from "./util/auth";

const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    element: <RootLayout />,
    loader: tokenLoader,
    children: [
      {
        path: "/:page?",
        element: <HomePage />,
      },
      {
        path: "/games/:gameId",
        element: <GameDetails />,
      },
      {
        path: "/wishlist",
        element: <WishlistPage />,
        loader: checkAuthLoader,
      },
      { path: "/login", element: <LoginPage /> },
      { path: "/sign-up", element: <SignupPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
