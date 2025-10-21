"use client";

import { useState, useEffect } from 'react';
import Navbar from '../../component/Navbar';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import Lottie from "lottie-react";
import loadingAnimation from "../../../public/animations/loading.json";

interface MenuItem {
    _id: string;
    name: string;
    date: string;
    day: string;
    meal_type: string;
    calories?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
}

interface GroupedMenu {
    [day: string]: {
        BREAKFAST: MenuItem[];
        LUNCH: MenuItem[];
        DINNER: MenuItem[];
    };
}

export default function MessMenuPage() {
    const [groupedMenu, setGroupedMenu] = useState<GroupedMenu>({});
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('smartDietUser');
        if (storedUser) {
            setUserName(JSON.parse(storedUser).name);
        }

        const fetchMenu = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/menu');
                const data: MenuItem[] | { message: string } = await response.json();

                if (response.ok && Array.isArray(data)) {
                    const grouped = data.reduce((acc: GroupedMenu, item) => {
                        const day = item.day.toUpperCase();
                        if (!acc[day]) {
                            acc[day] = { BREAKFAST: [], LUNCH: [], DINNER: [] };
                        }
                        if(item.meal_type === 'BREAKFAST' || item.meal_type === 'LUNCH' || item.meal_type === 'DINNER') {
                           acc[day][item.meal_type].push(item);
                        }
                        return acc;
                    }, {});
                    setGroupedMenu(grouped);
                } else {
                    setErrorMessage((data as { message: string }).message);
                }
            } catch (error) {
                console.error("Failed to fetch menu", error);
                setErrorMessage("Could not connect to the server.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchMenu();
    }, []);

    const weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen bg-white"><div className="w-48 h-48"><Lottie animationData={loadingAnimation} loop={true} /></div></div>;
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar userName={userName} />
            <main className="max-w-7xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">This Week's Mess Menu</h1>
                
                {errorMessage ? (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
                        <p className="font-bold">Heads Up!</p>
                        <p>{errorMessage}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {weekDays.map(day => groupedMenu[day] && (
                            <div key={day} className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold mb-4 text-indigo-600">{day.charAt(0) + day.slice(1).toLowerCase()}</h2>
                                {Object.entries(groupedMenu[day]).map(([mealType, items]) => (
                                    <div key={mealType} className="mb-4">
                                        <h3 className="font-semibold text-gray-700">{mealType.charAt(0) + mealType.slice(1).toLowerCase()}</h3>
                                        <ul className="list-disc list-inside text-gray-600 text-sm">
                                            {items.map(item => (
                                                <li key={item._id} className="mt-1">{item.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}