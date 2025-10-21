'use client';

import { BarChart2, Heart, LogOut, Settings, UtensilsCrossed } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';

const menuItems = [
  { name: 'Dashboard', icon: BarChart2, path: '/dashboard' },
  { name: 'Log Meal', icon: UtensilsCrossed, path: '/log' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('smartDietUser');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 flex items-center space-x-2 border-b border-slate-200">
        <Heart className="w-8 h-8 text-blue-600" />
        <span className="text-xl font-bold text-slate-900">SmartDiet</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={item.path}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              pathname === item.path
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </a>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;