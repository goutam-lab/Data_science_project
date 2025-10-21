"use client"

import { User } from 'lucide-react';

export default function Navbar({ userName }: { userName: string }) {
    const handleLogout = () => {
        localStorage.removeItem('smartDietUser');
        window.location.href = '/login';
    };

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <h1 className="text-xl font-bold text-indigo-600">SmartDiet</h1>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <a href="/dashboard" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Dashboard
                            </a>
                            {/* ADD THIS NEW LINK */}
                            <a href="/mess-menu" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Mess Menu
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-4">Welcome, {userName}</span>
                        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}