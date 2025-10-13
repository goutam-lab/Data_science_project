"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, BarChart2, Zap, Heart } from "lucide-react";
import Lottie from "lottie-react";
import characterAnimation from "../../public/animations/character.json";
import morphAnimation from "../../public/animations/Morphing Animation.json";

export default function LandingPage() {
  const [isMounted, setIsMounted] = useState(false);
  const localLottieRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="bg-white text-slate-800 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">SmartDiet</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors">
              How It Works
            </a>
          </nav>

          {/* Get Started Button with Morphing Animation */}
          <a
            href="/dashboard"
            className="hidden md:inline-flex items-center justify-center gap-2 px-5 py-2.5 text-base font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="w-6 h-6">
              <Lottie animationData={morphAnimation} loop={true} autoplay={true} />
            </div>
            <span>Get Started</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24">
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-900 mb-6">
                Your Personal Dietitian, Powered by <span className="text-blue-600">Data</span>.
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto md:mx-0">
                Stop guessing. Start tracking. SmartDiet analyzes your mess menu, calculates your nutritional needs, and gives you a clear path to your health goals.
              </p>
              <div className="flex justify-center md:justify-start space-x-4">
                <a
                  href="/dashboard"
                  className="group inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Hero Lottie Animation */}
            <div className="w-full max-w-md mx-auto h-auto">
              <Lottie
                lottieRef={localLottieRef}
                animationData={characterAnimation}
                loop={true}
                autoplay={true}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-slate-50 py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works in 3 Simple Steps
            </h2>
            <p className="text-slate-600 mb-12 max-w-2xl mx-auto">
              We make diet tracking effortless, even with a fixed mess menu.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              {[
                { step: 1, title: "Upload Your Menu", desc: "Snap a picture or paste the text of your weekly mess menu. Our AI will instantly digitize and analyze it." },
                { step: 2, title: "Log Your Meals", desc: "Simply select what you ate from the menu. We provide all the nutritional data, calculated just for you." },
                { step: 3, title: "Track & Achieve", desc: "Visualize your progress with beautiful charts and get smart recommendations to stay on track and reach your goals faster." }
              ].map((item) => (
                <div key={item.step} className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
                  <div className="flex items-center justify-center w-12 h-12 bg-sky-100 text-sky-600 rounded-full mb-4 font-bold text-xl">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="w-full max-w-md mx-auto h-auto">
                {/* Optional: Reuse character animation */}
                <Lottie
                  animationData={morphAnimation}
                  loop={true}
                  autoplay={true}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  Features Designed For You
                </h2>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-4 mt-1">
                      <Zap size={18} />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-slate-900">AI-Powered Menu Analysis</h4>
                      <p className="text-slate-600">Automatically get nutritional info for every item on your menu, no manual entry required.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-4 mt-1">
                      <BarChart2 size={18} />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-slate-900">Insightful Dashboards</h4>
                      <p className="text-slate-600">Track your calories, macros, and trends with easy-to-understand charts and graphs.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-4 mt-1">
                      <Heart size={18} />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-slate-900">Personalized Recommendations</h4>
                      <p className="text-slate-600">Get smart suggestions for meal swaps and additions to match your dietary needs.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} SmartDiet. All rights reserved.</p>
          <p className="text-slate-400 text-sm mt-2">Your intelligent path to better health.</p>
        </div>
      </footer>
    </div>
  );
}
