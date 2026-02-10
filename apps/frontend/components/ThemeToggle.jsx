'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-14 h-8" />; // Placeholder to prevent layout shift
    }

    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`
                relative w-16 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                ${isDark ? 'bg-slate-700' : 'bg-sky-200'}
            `}
            aria-label="Toggle Theme"
        >
            <div
                className={`
                    absolute left-1 top-1 bottom-1 w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center
                    ${isDark ? 'translate-x-8 bg-slate-800' : 'translate-x-0 bg-white'}
                `}
            >
                {isDark ? (
                    <Moon size={14} className="text-yellow-300" />
                ) : (
                    <Sun size={14} className="text-orange-400" />
                )}
            </div>

            {/* Background Icons (Decorative) */}
            <div className={`absolute left-2 top-1.5 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-100'}`}>

            </div>
            <div className={`absolute right-2 top-1.5 transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}`}>

            </div>
        </button>
    );
};

export default ThemeToggle;
