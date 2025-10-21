"use client";

import { useState } from 'react';
import Navbar from '../../../component/Navbar';
import { Bot, CheckCircle } from 'lucide-react';

// Define the structure of the menu for TypeScript
interface MenuData {
    [day: string]: {
        BREAKFAST?: string[];
        LUNCH?: string[];
        DINNER?: string[];
    };
}

export default function TextUploadPage() {
    const [menuText, setMenuText] = useState('');
    const [menuPreview, setMenuPreview] = useState<MenuData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handlePreview = async () => {
        if (!menuText) {
            setMessage("Please enter the menu text first.");
            return;
        }
        setIsLoading(true);
        setMessage('');
        setMenuPreview(null);

        try {
            // --- THIS IS THE CORRECTED LINE ---
            const response = await fetch('http://127.0.0.1:5000/menu/parse-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ menu_text: menuText }),
            });

            const data = await response.json();
            if (response.ok) {
                setMenuPreview(data);
            } else {
                // Display the specific error from the backend
                setMessage(`Error: ${data.message || "Failed to parse menu."}`);
            }
        } catch (error) {
            setMessage("Error: Could not connect to the backend server. Is it running?");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = async () => {
        if (!menuPreview) return;
        setIsLoading(true);
        setMessage('');

        try {
            // --- THIS IS THE CORRECTED LINE ---
            const response = await fetch('http://127.0.0.1:5000/menu/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(menuPreview),
            });
            const data = await response.json();
            setMessage(data.message);
            if (response.ok) {
                setMenuPreview(null);
                setMenuText('');
            }
        } catch (error) {
            setMessage("Error: Could not connect to the backend server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar userName="Admin" />
            <main className="max-w-4xl mx-auto py-10 px-4 space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Upload Menu via Text</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Paste the weekly menu text below. e.g., "Monday Breakfast: Poha, Lunch: Rajma Chawal...".
                    </p>
                    <textarea
                        value={menuText}
                        onChange={(e) => setMenuText(e.target.value)}
                        placeholder="Monday Breakfast: ..."
                        className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handlePreview}
                        disabled={isLoading}
                        className="mt-4 w-full flex justify-center items-center py-2 px-4 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400"
                    >
                        <Bot className="w-5 h-5 mr-2" />
                        {isLoading ? 'Parsing...' : 'Generate Preview'}
                    </button>
                </div>

                {menuPreview && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-bold mb-4">Menu Preview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(menuPreview).map(([day, meals]) => (
                                <div key={day} className="border p-4 rounded-lg">
                                    <h4 className="font-bold text-indigo-700">{day}</h4>
                                    {Object.entries(meals).map(([mealType, items]) => (
                                        <div key={mealType} className="mt-2">
                                            <h5 className="font-semibold text-sm">{mealType}</h5>
                                            <ul className="list-disc list-inside text-xs text-gray-600">
                                                {items.map((item, index) => <li key={index}>{item}</li>)}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handlePublish}
                            disabled={isLoading}
                            className="mt-6 w-full flex justify-center items-center py-2 px-4 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
                        >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            {isLoading ? 'Publishing...' : 'Confirm and Publish'}
                        </button>
                    </div>
                )}
                
                {message && <p className="text-center text-sm font-medium text-red-600 mt-4">{message}</p>}
            </main>
        </div>
    );
}