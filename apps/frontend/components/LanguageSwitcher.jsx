'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../providers/LanguageContext';
import * as Flags from 'country-flag-icons/react/3x2';
import { ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
    const { language, changeLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'th', name: 'ไทย', Flag: Flags.TH },
        { code: 'en', name: 'English', Flag: Flags.US },
    ];

    const currentLang = languages.find(l => l.code === language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label="Select Language"
            >
                <div className="w-6 h-6 rounded-full overflow-hidden relative shadow-sm border border-gray-100">
                    <currentLang.Flag className="w-full h-full object-cover" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {currentLang.code.toUpperCase()}
                </span>
                <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                changeLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                                ${language === lang.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}
                            `}
                        >
                            <div className="w-5 h-5 rounded-full overflow-hidden shadow-sm border border-gray-200">
                                <lang.Flag className="w-full h-full object-cover" />
                            </div>
                            <span>{lang.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
