"use client";

import React, { useState, useEffect } from 'react';
import { User, Activity, Target, Heart, Zap, Flame } from 'lucide-react';
import Lottie from "lottie-react";
import loadingAnimation from "../../../public/animations/loading.json";

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

// BMR and TDEE Calculation Logic
const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extra: 1.9,
};

const calculateBMR = (gender: 'male' | 'female', weight: number, height: number, age: number) => {
    if (gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
};

export default function DashboardPage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [bmr, setBmr] = useState(0);
    const [tdee, setTdee] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            const storedUser = localStorage.getItem('smartDietUser');
            if (!storedUser) {
                window.location.href = '/login';
                return;
            }

            const parsedUser = JSON.parse(storedUser);

            try {
                const response = await fetch(`http://127.0.0.1:5000/dashboard/${parsedUser.id}`);
                const data = await response.json();

                if (response.ok) {
                    if (!data.user.onboarding_complete) {
                        window.location.href = '/onboarding';
                        return;
                    }
                    setUser(data.user);
                    
                    // Calculate BMR and TDEE
                    const { gender, current_weight, height, age, activity_level } = data.user.onboarding;
                    const bmrValue = calculateBMR(gender, current_weight, height, age);
                    setBmr(Math.round(bmrValue));
                    setTdee(Math.round(bmrValue * activityMultipliers[activity_level as keyof typeof activityMultipliers]));

                } else {
                    // Handle error, maybe token expired, etc.
                    localStorage.removeItem('smartDietUser');
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (isLoading || !user) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="w-48 h-48">
                    <Lottie animationData={loadingAnimation} loop={true} autoplay={true} />
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-slate-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name}!</h1>
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
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            
                            {/* User Profile Card */}
                            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                                    <User className="w-6 h-6 mr-3 text-blue-500"/> Your Profile
                                </h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p><strong>Age:</strong> {user.onboarding?.age}</p>
                                    <p><strong>Gender:</strong> {user.onboarding?.gender}</p>
                                    <p><strong>Height:</strong> {user.onboarding?.height} cm</p>
                                    <p><strong>Current Weight:</strong> {user.onboarding?.current_weight} kg</p>
                                </div>
                            </div>
                            
                            {/* Goals Card */}
                            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                                    <Target className="w-6 h-6 mr-3 text-green-500"/> Your Goals
                                </h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p><strong>Goal Weight:</strong> {user.onboarding?.goal_weight} kg</p>
                                    <p><strong>Activity Level:</strong> <span className="capitalize">{user.onboarding?.activity_level}</span></p>
                                </div>
                            </div>

                            {/* BMR Card */}
                            <div className="bg-white overflow-hidden shadow rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center mb-2">
                                    <Heart className="w-6 h-6 mr-3 text-red-500"/> BMR
                                </h3>
                                <p className="text-4xl font-bold text-red-500">{bmr}</p>
                                <p className="text-xs text-gray-500 mt-1">Calories/day (at rest)</p>
                            </div>
                            
                            {/* TDEE Card */}
                            <div className="bg-white overflow-hidden shadow rounded-lg p-6 flex flex-col items-center justify-center text-center md:col-span-2 lg:col-span-1">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center mb-2">
                                    <Zap className="w-6 h-6 mr-3 text-yellow-500"/> Daily Calorie Needs (TDEE)
                                </h3>
                                <p className="text-5xl font-extrabold text-yellow-500">{tdee}</p>
                                <p className="text-sm text-gray-500 mt-1">Calories/day (maintenance)</p>
                            </div>

                             {/* Macronutrients Card (Example) */}
                            <div className="bg-white overflow-hidden shadow rounded-lg p-6 md:col-span-2">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                                    <Flame className="w-6 h-6 mr-3 text-orange-500"/> Daily Macronutrient Goals
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">Example targets for weight maintenance. These will be dynamic later.</p>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600">{Math.round((tdee * 0.4) / 4)}g</p>
                                        <p className="text-xs font-medium text-gray-500">Protein (40%)</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-purple-600">{Math.round((tdee * 0.3) / 4)}g</p>
                                        <p className="text-xs font-medium text-gray-500">Carbs (30%)</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-amber-600">{Math.round((tdee * 0.3) / 9)}g</p>
                                        <p className="text-xs font-medium text-gray-500">Fat (30%)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
