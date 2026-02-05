import React from 'react';
import { Info } from 'lucide-react';

const GapAnalysis = ({
    competencies,
    scores,
    requirements
}) => {
    return (
        <div className="gap-section card">
            <div className="card-header">
                <h2>
                    <Info size={20} className="section-icon" />
                    วิเคราะห์ช่องว่าง (Gap Analysis)
                </h2>
                <span className="info-badge">เทียบกับเกณฑ์หลักสูตร</span>
            </div>
            <div className="gap-grid">
                {competencies.map(id => {
                    const score = scores[id.id] || 0;
                    const target = requirements[id.id] || 0;
                    const gap = score - target;
                    const Icon = id.icon;

                    return (
                        <div key={id.id} className="gap-item">
                            <div className="gap-header">
                                <div className="gap-icon" style={{ backgroundColor: `${id.color}15`, color: id.color }}>
                                    <Icon size={16} />
                                </div>
                                <span className="gap-name">{id.name}</span>
                                <span className={`gap-value ${gap >= 0 ? 'positive' : 'negative'}`}>
                                    {gap >= 0 ? '+' : ''}{formatNumber(gap, 2)}
                                </span>
                            </div>
                            <div className="gap-bar">
                                <div
                                    className="gap-fill"
                                    style={{
                                        width: `${target > 0 ? Math.min(100, (score / target) * 100) : 0}%`,
                                        backgroundColor: gap >= 0 ? '#10b981' : '#f97316'
                                    }}
                                ></div>
                            </div>
                            <div className="gap-labels">
                                <span>คะแนน: {formatNumber(score, 2)}</span>
                                <span>เป้าหมาย: {formatNumber(target, 2)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GapAnalysis;

function formatNumber(value, decimals) {
    if (Number.isNaN(value)) return '0';
    const factor = 10 ** decimals;
    return (Math.round((value + Number.EPSILON) * factor) / factor).toFixed(decimals);
}
