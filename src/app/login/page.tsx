"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

// Sample comments for the floating effect
const comments = [
  { text: "Great platform, very intuitive!", author: "Alex D.", avatar: `https://i.pravatar.cc/40?u=alex` },
  { text: "The diet plans are amazing.", author: "Sarah P.", avatar: `https://i.pravatar.cc/40?u=sarah` },
  { text: "Finally reaching my fitness goals!", author: "Mike T.", avatar: `https://i.pravatar.cc/40?u=mike` },
  { text: "Love the analytics dashboard.", author: "Jessica L.", avatar: `https://i.pravatar.cc/40?u=jessica` },
  { text: "So easy to track my meals now!", author: "Chris B.", avatar: `https://i.pravatar.cc/40?u=chris` },
  { text: "The recommendations are spot on.", author: "Emily R.", avatar: `https://i.pravatar.cc/40?u=emily` },
];


export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If user is already logged in, redirect them away from login page
  useEffect(() => {
    if (localStorage.getItem('smartDietUser')) {
      window.location.href = '/dashboard';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const url = isLogin ? 'http://127.0.0.1:5000/login' : 'http://127.0.0.1:5000/signup';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin && data.user) {
          // On successful login, save user object to localStorage
          localStorage.setItem('smartDietUser', JSON.stringify(data.user));
          // Redirect to dashboard, which will handle the onboarding check
          window.location.href = data.user.onboarding_complete ? '/dashboard' : '/onboarding';
        } else {
          // On successful signup, prompt user to log in
          alert(data.message);
          setIsLogin(true);
        }
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert('A network error occurred. Please check the backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-sans overflow-hidden">
      {/* Floating Comments Section - UPDATED */}
      <div className="floating-container">
        {comments.map((comment, index) => (
          <div key={index} className={`floating-comment comment-${index + 1}`}>
            <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full mr-3 border border-slate-200" />
            <div>
              <p className="text-sm text-slate-700">{comment.text}</p>
              <p className="text-xs text-slate-500 font-medium">- {comment.author}</p>
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
            {isLogin ? "Sign in to continue your journey." : "Sign up to get started."}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
              <input type="text" id="name" name="name" className="mt-1 block w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
            <input type="email" id="email" name="email" className="mt-1 block w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" id="password" name="password" className="mt-1 block w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" disabled={isLoading} className="group w-full inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-blue-400 disabled:scale-100">
            {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
            {!isLoading && <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-8">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-blue-600 hover:underline">
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
