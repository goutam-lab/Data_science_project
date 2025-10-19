"use client";

import { Heart } from 'lucide-react';

interface NavbarProps {
    userName: string;
}

export default function Navbar({ userName }: NavbarProps) {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Heart className="w-8 h-8 text-blue-600" />
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back, {userName}!</h1>
                </div>
                <button
                    onClick={() => {
                        localStorage.removeItem('smartDietUser');
                        window.location.href = '/login';
                    }}
                    className="text-sm font-medium text-red-600 hover:text-red-800"
                >
                    Log Out
                </button>
            </div>
        </header>
    );
}