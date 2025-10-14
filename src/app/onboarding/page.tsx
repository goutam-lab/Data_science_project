"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const totalSteps = 4;

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [user, setUser] = useState<{ id: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        age: '',
        gender: 'male',
        height: '',
        current_weight: '',
        goal_weight: '',
        activity_level: 'sedentary',
        food_preferences: '',
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('smartDietUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // If no user is logged in, redirect to login page
            window.location.href = '/login';
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
    
    const handleSubmit = async () => {
        if (!user) return;
        setIsLoading(true);

        const payload = { ...formData, user_id: user.id };
        
        try {
            const response = await fetch('http://127.0.0.1:5000/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (response.ok) {
                // Update local storage to reflect onboarding is complete
                const updatedUser = { ...user, onboarding_complete: true };
                localStorage.setItem('smartDietUser', JSON.stringify(updatedUser));
                window.location.href = '/dashboard';
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            alert('A network error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        // Render a loading state or null while redirecting
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                <h1 className="text-3xl font-bold text-center text-slate-800">Tell Us About Yourself</h1>
                <p className="text-center text-slate-500 mt-2 mb-8">This will help us personalize your diet plan.</p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2.5 mb-8">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
                </div>

                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} className="mt-1 block w-full p-3 bg-slate-50 border border-slate-300 rounded-lg" placeholder="e.g., 25" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full p-3 bg-slate-50 border border-slate-300 rounded-lg">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Step 2: Body Metrics */}
                {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Height (cm)</label>
                            <input type="number" name="height" value={formData.height} onChange={handleChange} className="mt-1 block w-full p-3 bg-slate-50 border border-slate-300 rounded-lg" placeholder="e.g., 180" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Current Weight (kg)</label>
                            <input type="number" name="current_weight" value={formData.current_weight} onChange={handleChange} className="mt-1 block w-full p-3 bg-slate-50 border border-slate-300 rounded-lg" placeholder="e.g., 80" />
                        </div>
                    </div>
                )}

                {/* Step 3: Goals */}
                {step === 3 && (
                     <div className="space-y-6 animate-fade-in">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Goal Weight (kg)</label>
                            <input type="number" name="goal_weight" value={formData.goal_weight} onChange={handleChange} className="mt-1 block w-full p-3 bg-slate-50 border border-slate-300 rounded-lg" placeholder="e.g., 75" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Activity Level</label>
                            <select name="activity_level" value={formData.activity_level} onChange={handleChange} className="mt-1 block w-full p-3 bg-slate-50 border border-slate-300 rounded-lg">
                                <option value="sedentary">Sedentary (little or no exercise)</option>
                                <option value="light">Lightly active (light exercise/sports 1-3 days/week)</option>
                                <option value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</option>
                                <option value="active">Very active (hard exercise/sports 6-7 days a week)</option>
                                <option value="extra">Extra active (very hard exercise/sports & physical job)</option>
                            </select>
                        </div>
                    </div>
                )}
                
                {/* Step 4: Preferences */}
                {step === 4 && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Food Preferences / Allergies</label>
                            <textarea name="food_preferences" value={formData.food_preferences} onChange={handleChange} rows={4} className="mt-1 block w-full p-3 bg-slate-50 border border-slate-300 rounded-lg" placeholder="e.g., Vegetarian, allergic to peanuts..."></textarea>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="mt-8 flex justify-between items-center">
                    <button onClick={prevStep} disabled={step === 1 || isLoading} className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-slate-200 rounded-lg hover:bg-slate-300 disabled:opacity-50">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </button>
                    {step < totalSteps && (
                         <button onClick={nextStep} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    )}
                    {step === totalSteps && (
                        <button onClick={handleSubmit} disabled={isLoading} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-400">
                           {isLoading ? 'Saving...' : 'Finish & Go to Dashboard'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
