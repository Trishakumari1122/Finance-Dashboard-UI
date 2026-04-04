'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { useApp } from '@/context/AppContext';
import { getCategoryBreakdown } from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatters';
import SpotlightCard from '@/components/ui/SpotlightCard';
import styles from './SpendingBreakdown.module.css';

const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

    return (
        <g>
            {/* Soft background glow pulse behind the slice */}
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius - 6}
                outerRadius={outerRadius + 14}
                startAngle={startAngle - 2}
                endAngle={endAngle + 2}
                fill={fill}
                opacity={0.15}
            />
            {/* The main popped out slice */}
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius - 2}
                outerRadius={outerRadius + 12}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                style={{ filter: `drop-shadow(0px 8px 16px ${fill}60)` }}
            />
            
            {/* Perfectly proportioned and centered Typography with normalized font sizes */}
            <text x={cx} y={cy - 20} textAnchor="middle" dominantBaseline="middle" fill="var(--text-tertiary)" fontSize={12} fontWeight={500} opacity={0.9}>
                {payload.name}
            </text>
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="var(--text-primary)" fontSize={18} fontWeight={700}>
                {formatCurrency(value)}
            </text>
            <text x={cx} y={cy + 20} textAnchor="middle" dominantBaseline="middle" fill={fill} fontSize={12} fontWeight={700}>
                {`${(percent * 100).toFixed(1)}%`}
            </text>
        </g>
    );
};

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload[0]) return null;
    const data = payload[0].payload;
    return (
        <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            boxShadow: 'var(--shadow-lg)',
        }}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                {data.icon} {data.name}
            </p>
            <p style={{ color: data.color, fontSize: '0.8rem', marginTop: 4 }}>
                {formatCurrency(data.value)}
            </p>
        </div>
    );
};

export default function SpendingBreakdown() {
    const { state } = useApp();
    const data = getCategoryBreakdown(state.transactions);
    const total = data.reduce((sum, d) => sum + d.value, 0);

    const [activeIndex, setActiveIndex] = useState(-1);

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(-1);
    };

    if (data.length === 0) {
        return (
            <SpotlightCard className={styles.breakdownCard}>
                <div className={styles.header}>
                    <div>
                        <div className={styles.title}>Spending Breakdown</div>
                        <div className={styles.subtitle}>Expenses by category</div>
                    </div>
                </div>
                <div className={styles.emptyChart}>
                    <div className={styles.emptyChartIcon}>🍩</div>
                    <div className={styles.emptyChartText}>No expense data to display</div>
                </div>
            </SpotlightCard>
        );
    }

    return (
        <SpotlightCard className={styles.breakdownCard} highlightColor="rgba(244, 63, 94, 0.05)">
            <div className={styles.header}>
                <div>
                    <div className={styles.title}>Spending Breakdown</div>
                    <div className={styles.subtitle}>Expenses by category</div>
                </div>
                <span className={styles.badge}>{data.length} categories</span>
            </div>
            <div className={styles.content}>
                <div className={styles.chartArea}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={72}
                                outerRadius={100}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                onMouseEnter={onPieEnter}
                                onMouseLeave={onPieLeave}
                                animationDuration={2500}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.legend}>
                    {data.map((item, index) => (
                        <div key={index} className={styles.legendItem}>
                            <span className={styles.legendDot} style={{ background: item.color }} />
                            <span className={styles.legendLabel}>{item.icon} {item.name}</span>
                            <span className={styles.legendValue}>{formatCurrency(item.value)}</span>
                            <span className={styles.legendPercent}>
                                {((item.value / total) * 100).toFixed(1)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </SpotlightCard>
    );
}
