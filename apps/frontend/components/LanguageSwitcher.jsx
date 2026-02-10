'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../providers/LanguageContext';
import { Globe, Check } from 'lucide-react';

const LanguageSwitcher = ({ className = '' }) => {
    const { language, changeLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'th', name: 'ไทย', flag: '🇹🇭' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
    ];

    const currentLang = languages.find((l) => l.code === language) || languages[0];

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
        <div className={`lang-switcher-wrapper ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`lang-switcher-btn ${isOpen ? 'active' : ''}`}
                aria-label="Select Language"
                aria-expanded={isOpen}
            >
                <Globe size={15} strokeWidth={2} className="lang-globe-icon" />
                <span className="lang-code">{currentLang.code.toUpperCase()}</span>
            </button>

            {isOpen && (
                <div className="lang-dropdown">
                    <div className="lang-dropdown-inner">
                        {languages.map((lang) => (
                            <button
                                type="button"
                                key={lang.code}
                                onClick={() => {
                                    changeLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className={`lang-dropdown-item ${language === lang.code ? 'selected' : ''}`}
                            >
                                <span className="lang-flag">{lang.flag}</span>
                                <span className="lang-label">{lang.name}</span>
                                {language === lang.code && <Check size={14} className="lang-check" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
