"use client";

import { useState } from 'react';
import Lottie from "lottie-react";
import characterAnimation from "../../../public/animations/character.json";

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://127.0.0.1:5000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                // Redirect to login after a short delay
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                setError(data.message || 'Sign up failed');
            }
        } catch (err) {
            setError('Could not connect to the server');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl max-w-4xl">
                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Create Your Account</h2>
                    <p className="text-gray-600 mb-8">Join SmartDiet and start your health journey today.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {message && <p className="text-green-500 text-sm">{message}</p>}

                        <button type="submit" className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition">
                            Sign Up
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Log in</a>
                    </p>
                </div>

                {/* Right Side - Animation */}
                <div className="hidden md:block w-1/2 p-8 bg-indigo-500 rounded-r-2xl">
                    <Lottie animationData={characterAnimation} loop={true} autoplay={true} />
                </div>
            </div>
        </div>
    );
}