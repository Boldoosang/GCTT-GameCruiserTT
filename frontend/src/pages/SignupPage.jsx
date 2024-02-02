import React, { useState, useEffect } from "react";
import { getBackendURL } from "../util/server";
import { useNavigate, Link } from "react-router-dom";
import { clearToken } from "../util/auth";

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState();
  const [messageStyle, setMessageStyle] = useState();

  const navigate = useNavigate();

  function handleSignupSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const elements = form.elements;
    const email = elements.email.value;
    const password = elements.password.value;
    const confirmPassword = elements["confirm-password"].value;
    const tos = elements.tos.value;
    setMessage();

    setIsSubmitting(true);
    fetch(`${getBackendURL()}/user/signup`, {
      method: "POST",
      body: JSON.stringify({ email, password, confirmPassword, tos }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json();
        console.log(data);
        setMessage(data?.message ?? "Unknown error occurred.");
        if (response.status === 422) {
          setMessageStyle("text-red-400");
          clearToken();
          return;
        }

        console.log("testsets 1");
        console.log(message);
        if (!response.ok) {
          setMessageStyle("text-red-400");

          return;
        }

        setIsSubmitting(false);
        console.log("testsets 2");
        setMessageStyle("text-green-400");
        console.log("testsets 3");

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
        setMessageStyle("text-red-400");
        setMessage("Backend offline. Please try again later.");
      });
    setIsSubmitting(false);
  }

  return (
    <div className="container mx-auto">
      <div className="lg:w-[50vw] xs:w-[90vw] mx-auto bg-slate-900/40 rounded-lg p-3 my-3">
        <h2 className="text-3xl font-bold text-slate-300">Sign Up</h2>

        <p className="text-slate-200 mt-2">
          Please register to use GameCruiserTT.
        </p>
        {message && (
          <div className={`mt-2 ${messageStyle}`}>
            <p>{message}</p>
          </div>
        )}
        <form onSubmit={handleSignupSubmit} className="flex flex-col">
          <div className="flex flex-col mt-3">
            <label className="text-slate-400 font-bold" htmlFor="email">
              Your Email
            </label>
            <input
              className="rounded-sm mt-1 h-8 p-2 bg-slate-800 text-slate-200"
              name="email"
              id="email"
              type="email"
              required
              placeholder="name@mail.com"
            />
          </div>
          <div className="flex flex-col mt-3">
            <label className="text-slate-400 font-bold" htmlFor="password">
              Password
            </label>
            <input
              className="rounded-sm mt-1 h-8 p-2 bg-slate-800 text-slate-200"
              type="password"
              name="password"
              id="password"
              required
              placeholder="********"
            />
          </div>
          <div className="flex flex-col mt-3">
            <label
              className="text-slate-400 font-bold"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              className="rounded-sm mt-1 h-8 p-2 bg-slate-800 text-slate-200"
              type="password"
              id="confirm-password"
              name="confirm-password"
              required
              placeholder="********"
            />
          </div>
          <div className="flex mt-3 gap-2">
            <input type="checkbox" id="tos" required value="yes" name="tos" />
            <label className="text-slate-200" htmlFor="tos">
              I agree to the terms of service.
            </label>
          </div>
          <button
            type="submit"
            disabled={isSubmitting ? true : false}
            className="block ms-auto bg-slate-600 hover:bg-slate-800 text-white font-bold py-2 px-8 rounded transition"
          >
            {!isSubmitting ? "Sign Up" : "Submitting..."}
          </button>
          <p className="block text-center text-slate-200">
            Already have an account?{" "}
            <Link className="text-blue-400 underline" to="/login">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
