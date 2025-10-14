"use client";

import React, { useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import Lottie from "lottie-react";
import characterAnimation from "../../../public/animations/character.json";

// Sample comments for the floating effect
const comments = [
  {
    text: "Great platform, very intuitive!",
    author: "Alex D.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    text: "The diet plans are amazing.",
    author: "Sarah P.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    text: "Finally reaching my fitness goals!",
    author: "Mike T.",
    avatar: "https://randomuser.me/api/portraits/men/56.jpg",
  },
  {
    text: "Love the analytics dashboard.",
    author: "Jessica L.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-sans overflow-hidden">
      {/* Floating Comments Section */}
      <div className="floating-comments-container">
        {comments.map((comment, index) => (
          <div key={index} className={`floating-comment comment-${index + 1}`}>
            <img
              src={comment.avatar}
              alt={comment.author}
              className="w-8 h-8 rounded-full mr-3"
            />
            <div>
              <p className="text-sm text-slate-700">{comment.text}</p>
              <p className="text-xs text-slate-500 font-medium">
                - {comment.author}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-slate-600 mt-2">
            {isLogin
              ? "Sign in to continue your journey."
              : "Sign up to get started."}
          </p>
        </div>

        <form className="space-y-6">
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="group w-full inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {isLogin ? "Log In" : "Sign Up"}
            <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-8">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-blue-600 hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}