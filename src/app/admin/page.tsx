"use client";

import Navbar from '../../component/Navbar';
import { Upload, Type } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
    const [userName, setUserName] = useState('Admin');

    useEffect(() => {
        const storedUser = localStorage.getItem('smartDietUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            // Check if the user is actually an admin before showing the page
            if (user.email !== 'goutam54401@gmail.com') {
                window.location.href = '/dashboard'; // Redirect non-admins
            }
            setUserName(user.name);
        } else {
            window.location.href = '/login'; // Redirect if not logged in
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar userName={userName} />
            <main className="max-w-4xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Control Panel</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card for Text Upload */}
                    <a href="/admin/text-upload" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center mb-4">
                            <Type className="w-8 h-8 text-indigo-500 mr-4" />
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Upload via Text</h2>
                        </div>
                        <p className="font-normal text-gray-700">Paste the menu as plain text for our AI to parse, preview, and publish.</p>
                    </a>

                    {/* Card for File Upload */}
                    <div className="block p-6 bg-gray-200 rounded-lg border border-gray-300 shadow-md cursor-not-allowed">
                         <div className="flex items-center mb-4">
                            <Upload className="w-8 h-8 text-gray-500 mr-4" />
                            <h2 className="text-2xl font-bold tracking-tight text-gray-500">Upload via File</h2>
                        </div>
                        <p className="font-normal text-gray-500">(Image/CSV upload feature coming soon)</p>
                    </div>
                </div>
            </main>
        </div>
    );
}