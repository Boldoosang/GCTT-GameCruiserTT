import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setAuthToken } from "../util/auth";
import { getBackendURL } from "../util/server";

export default function LoginPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleLoginSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const elements = form.elements;
    const email = elements.email.value;
    const password = elements.password.value;
    setMessage("");

    setIsSubmitting(true);
    fetch(`${getBackendURL()}/user/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 422) {
          setMessageStyle("text-red-400");
          clearToken();
          return;
        }
        if (!response.ok) {
          setMessage(data.message);
          setMessageStyle("text-red-400");
          return;
        }
        setMessage("Login successful. Redirecting to home page...");
        setAuthToken(data.token);
        setIsSubmitting(false);
        setMessageStyle("text-green-400");
        setTimeout(() => {
          window.location = "/";
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
        setMessageStyle("text-red-400");
        setMessage("Backend offline. Please try again later.");
      });
    setIsSubmitting(false);
  }
  useEffect(() => {
    document.title = "GameCruiserTT - Login";
  });
  return (
    <div className="container mx-auto">
      <div className="lg:w-[50vw] xs:w-[90vw] mx-auto bg-slate-900/40 rounded-lg p-5 my-3">
        <h2 className="text-3xl font-bold text-slate-300">Login</h2>
        <p className="text-slate-200 mt-2">
          Please login to GameCruiserTT with your credentials.
        </p>
        {message && (
          <div className={`mt-2 ${messageStyle}`}>
            <p>{message}</p>
          </div>
        )}
        <form onSubmit={handleLoginSubmit} className="flex-col">
          <div className="my-3 flex-col">
            <div className="w-full flex flex-col mb-3">
              <label className="text-slate-400 font-bold" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required={true}
                placeholder="name@mail.com"
                className="rounded-sm mt-1 h-10 p-2 bg-slate-800 text-slate-200"
              />
            </div>
            <div className="w-full flex flex-col mb-3">
              <label className="text-slate-400 font-bold" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required={true}
                placeholder="********"
                className="rounded-sm mt-1 h-10 p-2 bg-slate-800 text-slate-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="block ms-auto bg-slate-600 hover:bg-slate-800 text-white font-bold py-2 px-8 rounded transition"
          >
            {isSubmitting ? "Submitting..." : "Login"}
          </button>
          <p color="white" className="block text-center text-slate-200">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-blue-400 underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
