import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css";
import { motion, AnimatePresence } from "framer-motion";

document.title = "GameCruiserTT";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AnimatePresence>
        <App />
      </AnimatePresence>
    </QueryClientProvider>
  </React.StrictMode>
);
