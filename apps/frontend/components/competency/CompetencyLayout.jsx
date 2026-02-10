'use client';

import React, { useState } from 'react';
import {
    GraduationCap, LayoutDashboard, User, ClipboardCheck,
    Menu, X, ChevronDown, LogOut
} from 'lucide-react';
import ColorBends from '../ColorBends';
import { BACKGROUND_COLORS } from '../../config/theme';

const CompetencyLayout = ({ children, activePage, onNavigate, user, loading, onLogout }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleNavigate = (page) => {
        onNavigate(page);
        setMobileMenuOpen(false);
    };

    const userDisplayName = user?.display_name || user?.username || 'Guest';
    const primaryRole = user?.roles?.[0] || 'No Role';
    const avatarLabel = userDisplayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || 'U';

    return (
        <>
            <ColorBends
                className="color-bends-bg"
                transparent={true}
                colors={BACKGROUND_COLORS}
                rotation={0}
                autoRotate={0}
                speed={0.2}
                scale={0.7}
                frequency={1}
                warpStrength={1}
                mouseInfluence={1}
                parallax={0.5}
                noise={0.1}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: -1,
                    pointerEvents: 'none',
                    background: '#ffffff',
                    opacity: 0.5,
                }}
            />
            <div className="competency-app">
                {/* NAVBAR */}
                <nav className="navbar">
                    <div className="container nav-inner">
                        <div className="logo">
                            <div className="logo-icon">
                                <GraduationCap size={24} />
                            </div>
                            <span className="logo-text">KKU Competency</span>
                        </div>

                        <div className="nav-menu">
                            <button
                                className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
                                onClick={() => handleNavigate('dashboard')}
                            >
                                <LayoutDashboard size={18} />
                                <span>แดชบอร์ด</span>
                            </button>
                            <button
                                className={`nav-item ${activePage === 'profile' ? 'active' : ''}`}
                                onClick={() => handleNavigate('profile')}
                            >
                                <User size={18} />
                                <span>ประวัติส่วนตัว</span>
                            </button>
                            <button
                                className={`nav-item ${activePage === 'verify' ? 'active' : ''}`}
                                onClick={() => handleNavigate('verify')}
                            >
                                <ClipboardCheck size={18} />
                                <span>ตรวจสอบข้อมูล</span>
                            </button>
                        </div>

                        <div className="user-area-wrapper">
                            <button
                                type="button"
                                className="user-area"
                                onClick={() => setUserMenuOpen((prev) => !prev)}
                            >
                                <div className="user-info">
                                    <span className="user-name">{loading ? 'Checking session...' : userDisplayName}</span>
                                    <span className="user-role">{primaryRole}</span>
                                </div>
                                <div className="avatar">{avatarLabel}</div>
                                <ChevronDown size={16} className={`user-chevron ${userMenuOpen ? 'open' : ''}`} />
                            </button>
                            {user && userMenuOpen && (
                                <div className="user-dropdown">
                                    <button type="button" className="logout-btn" onClick={onLogout}>
                                        <LogOut size={16} />
                                        <span>ออกจากระบบ</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </nav>

                {/* MOBILE MENU DRAWER */}
                {mobileMenuOpen && (
                    <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
                        <div className="mobile-menu-drawer left" onClick={e => e.stopPropagation()}>
                            <div className="mobile-menu-header">
                                <div className="logo-icon small">
                                    <GraduationCap size={20} />
                                </div>
                                <span>KKU Competency</span>
                                <button className="close-drawer-btn" onClick={() => setMobileMenuOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="mobile-nav-items">
                                <button
                                    className={`mobile-nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
                                    onClick={() => handleNavigate('dashboard')}
                                >
                                    <LayoutDashboard size={20} />
                                    <span>แดชบอร์ด</span>
                                </button>
                                <button
                                    className={`mobile-nav-item ${activePage === 'profile' ? 'active' : ''}`}
                                    onClick={() => handleNavigate('profile')}
                                >
                                    <User size={20} />
                                    <span>ประวัติส่วนตัว</span>
                                </button>
                                <button
                                    className={`mobile-nav-item ${activePage === 'verify' ? 'active' : ''}`}
                                    onClick={() => handleNavigate('verify')}
                                >
                                    <ClipboardCheck size={20} />
                                    <span>ตรวจสอบข้อมูล</span>
                                </button>
                            </div>
                            <div className="mobile-user-section">
                                <div className="avatar">{avatarLabel}</div>
                                <div>
                                    <span className="user-name">{loading ? 'Checking session...' : userDisplayName}</span>
                                    <span className="user-role">Role: {primaryRole}</span>
                                </div>
                            </div>
                            {user && (
                                <div className="mobile-logout-wrap">
                                    <button
                                        type="button"
                                        className="logout-btn mobile"
                                        onClick={onLogout}
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* MAIN CONTENT */}
                <main className="main-content">
                    <div className="container">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
};

export default CompetencyLayout;
