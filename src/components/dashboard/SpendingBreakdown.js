'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { useApp } from '@/context/AppContext';
import { getCategoryBreakdown } from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatters';
import SpotlightCard from '@/components/ui/SpotlightCard';
import styles from './SpendingBreakdown.module.css';

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 8) * cos;
    const sy = cy + (outerRadius + 8) * sin;
    const mx = cx + (outerRadius + 22) * cos;
    const my = cy + (outerRadius + 22) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 18;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 8}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                style={{ filter: `drop-shadow(0px 0px 8px ${fill}90)` }}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} textAnchor={textAnchor} fill="var(--text-primary)" fontSize={12} fontWeight={600}>
                {payload.name}
            </text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} dy={16} textAnchor={textAnchor} fill="var(--text-tertiary)" fontSize={11}>
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

    useEffect(() => {
        if (data.length <= 1) return;
        
        // Delay the auto-cycler so Recharts can finish its own draw animation
        const initialTimeout = setTimeout(() => {
            setActiveIndex(0);
            
            const interval = setInterval(() => {
                setActiveIndex((current) => (current + 1) % data.length);
            }, 3000);
            
            // Store interval ID on window to clear it later (hacky but works since useEffect cleanup is tricky with nested timeouts)
            window._pieInterval = interval;
            
        }, 2500);

        return () => {
            clearTimeout(initialTimeout);
            if (window._pieInterval) clearInterval(window._pieInterval);
        };
    }, [data.length]);

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
                                activeIndex={activeIndex >= 0 ? activeIndex : undefined}
                                activeShape={activeIndex >= 0 ? renderActiveShape : undefined}
                                onMouseEnter={(_, index) => {
                                    if (window._pieInterval) clearInterval(window._pieInterval);
                                    setActiveIndex(index);
                                }}
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={65}
                                outerRadius={95}
                                paddingAngle={3}
                                dataKey="value"
                                animationDuration={2500}
                                animationEasing="ease-out"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
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
