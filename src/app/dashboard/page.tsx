"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { User, Target, Heart, Zap, Flame, BarChart, ShieldCheck, Sparkles } from 'lucide-react';
import Lottie from "lottie-react";
import loadingAnimation from "../../../public/animations/loading.json";
import Navbar from '../../component/Navbar';

// --- Type Definitions ---
interface UserData {
    _id: string;
    name: string;
    email: string;
    onboarding_complete: boolean;
    onboarding?: {
        age: number;
        gender: 'male' | 'female';
        height: number;
        current_weight: number;
        goal_weight: number;
        activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'extra';
    }
}
interface MenuItem {
    _id: string;
    name: string;
    day: string;
    meal_type: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}
interface Nutrition {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

// --- Calculation Logic ---
const activityMultipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, extra: 1.9 };
const calculateBMR = (gender: 'male' | 'female', weight: number, height: number, age: number) => {
    if (gender === 'male') return 10 * weight + 6.25 * height - 5 * age + 5;
    return 10 * weight + 6.25 * height - 5 * age - 161;
};

// --- Main Dashboard Component ---
export default function DashboardPage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [bmr, setBmr] = useState(0);
    const [tdee, setTdee] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [totalNutrition, setTotalNutrition] = useState<Nutrition>({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    const [suggestion, setSuggestion] = useState('');
    const [isSuggesting, setIsSuggesting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const storedUser = localStorage.getItem('smartDietUser');
            if (!storedUser) { window.location.href = '/login'; return; }
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.email === 'goutam54401@gmail.com') setIsAdmin(true);

            try {
                const [userResponse, menuResponse] = await Promise.all([
                    fetch(`http://127.0.0.1:5000/dashboard/${parsedUser.id}`),
                    fetch(`http://127.0.0.1:5000/menu`)
                ]);

                const userData = await userResponse.json();
                if (userResponse.ok) {
                    if (!userData.user.onboarding_complete) { window.location.href = '/onboarding'; return; }
                    setUser(userData.user);
                    const { gender, current_weight, height, age, activity_level } = userData.user.onboarding;
                    const bmrValue = calculateBMR(gender, current_weight, height, age);
                    setBmr(Math.round(bmrValue));
                    setTdee(Math.round(bmrValue * activityMultipliers[activity_level as keyof typeof activityMultipliers]));
                } else {
                    localStorage.removeItem('smartDietUser'); window.location.href = '/login';
                }

                const menuData = await menuResponse.json();
                if (menuResponse.ok) setMenu(menuData);

            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const todayMenu = useMemo(() => {
        const today = new Date().toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
        const meals: { BREAKFAST: MenuItem[], LUNCH: MenuItem[], DINNER: MenuItem[] } = { BREAKFAST: [], LUNCH: [], DINNER: [] };
        menu.forEach(item => {
            if (item.day === today) {
                if (item.meal_type === 'BREAKFAST' || item.meal_type === 'LUNCH' || item.meal_type === 'DINNER') {
                    meals[item.meal_type].push(item);
                }
            }
        });
        return meals;
    }, [menu]);

    const handleItemSelect = (itemId: string) => {
        const newSelectedItems = new Set(selectedItems);
        if (newSelectedItems.has(itemId)) newSelectedItems.delete(itemId);
        else newSelectedItems.add(itemId);
        setSelectedItems(newSelectedItems);
    };

    useEffect(() => {
        let totals: Nutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        selectedItems.forEach(itemId => {
            const item = menu.find(m => m._id === itemId);
            if (item) {
                totals.calories += item.calories || 0;
                totals.protein += item.protein || 0;
                totals.carbs += item.carbs || 0;
                totals.fat += item.fat || 0;
            }
        });
        setTotalNutrition(totals);
    }, [selectedItems, menu]);

    const getSuggestion = async () => {
        setIsSuggesting(true);
        setSuggestion('');
        try {
            const goals = { tdee, protein: Math.round((tdee * 0.4) / 4), carbs: Math.round((tdee * 0.3) / 4), fat: Math.round((tdee * 0.3) / 9) };
            
            //
            // --- THIS IS THE CORRECTED AND FINAL LINE ---
            //
            const response = await fetch('http://127.0.0.1:5000/menu/suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goals, current: totalNutrition })
            });

            const data = await response.json();
            if (response.ok) {
                setSuggestion(data.suggestion);
            } else {
                setSuggestion(`Error from server: ${data.message}`);
            }
        } catch (error) {
            console.error("Failed to get suggestion", error);
            setSuggestion('Could not connect to the server to get a suggestion.');
        } finally {
            setIsSuggesting(false);
        }
    };

    if (isLoading || !user) {
        return <div className="flex justify-center items-center min-h-screen"><Lottie animationData={loadingAnimation} loop={true} /></div>;
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar userName={user.name} />
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0 space-y-8">
                        {isAdmin && (
                            <div className="mb-6">
                                <a href="/admin" className="inline-flex items-center gap-2 px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium shadow-lg">
                                    <ShieldCheck /><span>Go to Admin Panel</span>
                                </a>
                            </div>
                        )}

                        <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Meal Selection</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {Object.entries(todayMenu).map(([mealType, items]) => (
                                    <div key={mealType}>
                                        <h4 className="font-semibold mb-2 capitalize">{mealType.toLowerCase()}</h4>
                                        <div className="space-y-2">
                                            {items.length > 0 ? items.map(item => (
                                                <label key={item._id} className="flex items-center space-x-2 cursor-pointer">
                                                    <input type="checkbox" checked={selectedItems.has(item._id)} onChange={() => handleItemSelect(item._id)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                                                    <span className="text-sm">{item.name}</span>
                                                </label>
                                            )) : <p className="text-xs text-gray-500">No items on menu.</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t">
                                <h4 className="font-bold">Total Intake So Far:</h4>
                                <div className="text-sm grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                    <p>Calories: {totalNutrition.calories.toFixed(0)} / {tdee}</p>
                                    <p>Protein: {totalNutrition.protein.toFixed(0)}g</p>
                                    <p>Carbs: {totalNutrition.carbs.toFixed(0)}g</p>
                                    <p>Fat: {totalNutrition.fat.toFixed(0)}g</p>
                                </div>
                                <button onClick={getSuggestion} disabled={isSuggesting} className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
                                    <Sparkles size={16} /> {isSuggesting ? 'Thinking...' : 'Get Suggestion'}
                                </button>
                                {suggestion && <p className="mt-4 text-sm bg-indigo-50 p-3 rounded-md border border-indigo-200">{suggestion}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}