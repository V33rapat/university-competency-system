'use client';

import React from 'react';
import { useLanguage } from '../../providers/LanguageContext';

const LoadingSkeleton = () => {
    const { t } = useLanguage();

    return (
        <div className="loading-skeleton-container">
            {/* Animated Logo Spinner */}
            <div className="loading-spinner-wrapper">
                <div className="loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring spinner-ring-2"></div>
                    <div className="spinner-dot"></div>
                </div>
                <p className="loading-text">{t('loading')}</p>
            </div>

            {/* Skeleton Cards */}
            <div className="skeleton-grid">
                {/* Stats skeleton */}
                <div className="skeleton-stats">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton-stat-card">
                            <div className="skeleton-icon skeleton-pulse"></div>
                            <div className="skeleton-stat-text">
                                <div className="skeleton-line skeleton-line-short skeleton-pulse"></div>
                                <div className="skeleton-line skeleton-line-wide skeleton-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main content skeleton */}
                <div className="skeleton-main">
                    <div className="skeleton-chart-card">
                        <div className="skeleton-card-header skeleton-pulse"></div>
                        <div className="skeleton-chart-area">
                            <div className="skeleton-radar skeleton-pulse"></div>
                        </div>
                    </div>
                    <div className="skeleton-filter-card">
                        <div className="skeleton-card-header skeleton-pulse"></div>
                        <div className="skeleton-filter-lines">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="skeleton-line skeleton-pulse" style={{ width: `${85 - i * 12}%` }}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;
