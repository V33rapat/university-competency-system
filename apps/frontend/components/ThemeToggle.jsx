'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '../providers/theme-provider';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '' }) => {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !resolvedTheme) {
        return <div className={`theme-toggle-skeleton ${className}`} />;
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`theme-toggle-btn ${isDark ? 'dark' : 'light'} ${className}`}
            aria-label="Toggle theme"
            aria-pressed={isDark}
        >
            <div className="theme-toggle-track">
                {/* Background icons */}
                <div className="theme-toggle-icon sun-icon">
                    <Sun size={13} strokeWidth={2.5} />
                </div>
                <div className="theme-toggle-icon moon-icon">
                    <Moon size={13} strokeWidth={2.5} />
                </div>

                {/* Sliding thumb with active icon */}
                <div className="theme-toggle-thumb">
                    {isDark ? (
                        <Moon size={13} strokeWidth={2.5} className="thumb-icon-dark" />
                    ) : (
                        <Sun size={13} strokeWidth={2.5} className="thumb-icon-light" />
                    )}
                </div>
            </div>
        </button>
    );
};

export default ThemeToggle;
