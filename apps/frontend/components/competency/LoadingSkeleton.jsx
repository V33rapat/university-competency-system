'use client';

import React from 'react';
import { useLanguage } from '../../providers/LanguageContext';

const LoadingSkeleton = () => {
    const { t } = useLanguage();

    return (
        <div className="fullpage-skeleton">
            {/* Skeleton Navbar */}
            <div className="skeleton-navbar">
                <div className="container skeleton-nav-inner">
                    <div className="skeleton-logo">
                        <div className="skeleton-logo-icon skeleton-shimmer"></div>
                        <div className="skeleton-logo-text skeleton-shimmer"></div>
                    </div>
                    <div className="skeleton-nav-menu">
                        <div className="skeleton-nav-btn skeleton-shimmer"></div>
                        <div className="skeleton-nav-btn skeleton-shimmer"></div>
                        <div className="skeleton-nav-btn skeleton-shimmer"></div>
                    </div>
                    <div className="skeleton-user">
                        <div className="skeleton-user-text skeleton-shimmer"></div>
                        <div className="skeleton-avatar skeleton-shimmer"></div>
                    </div>
                </div>
            </div>

            {/* Skeleton Content */}
            <div className="skeleton-content">
                <div className="container">
                    {/* Spinner Overlay */}
                    <div className="skeleton-spinner-area">
                        <div className="loading-spinner">
                            <div className="spinner-ring"></div>
                            <div className="spinner-ring spinner-ring-2"></div>
                            <div className="spinner-dot"></div>
                        </div>
                        <p className="loading-text">{t('loading')}</p>
                    </div>

                    {/* Stats skeleton row */}
                    <div className="skeleton-stats">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton-stat-card">
                                <div className="skeleton-icon skeleton-shimmer"></div>
                                <div className="skeleton-stat-text">
                                    <div className="skeleton-line skeleton-line-short skeleton-shimmer"></div>
                                    <div className="skeleton-line skeleton-line-wide skeleton-shimmer"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dashboard grid skeleton */}
                    <div className="skeleton-dashboard">
                        {/* Chart card */}
                        <div className="skeleton-card-block">
                            <div className="skeleton-card-header skeleton-shimmer"></div>
                            <div className="skeleton-chart-body">
                                <div className="skeleton-radar skeleton-shimmer"></div>
                            </div>
                            <div className="skeleton-card-footer">
                                <div className="skeleton-legend skeleton-shimmer"></div>
                                <div className="skeleton-legend skeleton-shimmer"></div>
                            </div>
                        </div>
                        {/* Filter card */}
                        <div className="skeleton-card-block">
                            <div className="skeleton-card-header skeleton-shimmer"></div>
                            <div className="skeleton-filter-body">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="skeleton-line skeleton-shimmer" style={{ width: `${95 - i * 10}%` }}></div>
                                ))}
                                <div className="skeleton-chip-row">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="skeleton-chip skeleton-shimmer"></div>
                                    ))}
                                </div>
                                {[1, 2].map((i) => (
                                    <div key={i} className="skeleton-line skeleton-shimmer" style={{ width: `${70 - i * 15}%` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;
