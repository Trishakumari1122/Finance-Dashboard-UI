'use client';

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { getMonthlyTrend } from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatters';
import SpotlightCard from '@/components/ui/SpotlightCard';
import styles from './ChartCard.module.css';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
        <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            boxShadow: 'var(--shadow-lg)',
        }}>
            <p style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{label}</p>
            {payload.map((entry, i) => (
                <p key={i} style={{ color: entry.color, fontSize: '0.8rem', margin: '3px 0' }}>
                    {entry.name}: {formatCurrency(entry.value)}
                </p>
            ))}
        </div>
    );
};

export default function BalanceTrendChart() {
    const { state } = useApp();
    const data = getMonthlyTrend(state.transactions);

    if (data.length === 0) {
        return (
            <SpotlightCard className={styles.chartCard}>
                <div className={styles.chartHeader}>
                    <div>
                        <div className={styles.chartTitle}>Balance Trend</div>
                        <div className={styles.chartSubtitle}>Income vs Expenses over time</div>
                    </div>
                </div>
                <div className={styles.emptyChart}>
                    <div className={styles.emptyChartIcon}>📊</div>
                    <div className={styles.emptyChartText}>No data to display</div>
                </div>
            </SpotlightCard>
        );
    }

    return (
        <SpotlightCard className={styles.chartCard} highlightColor="rgba(99, 102, 241, 0.05)">
            <div className={styles.chartHeader}>
                <div>
                    <div className={styles.chartTitle}>Balance Trend</div>
                    <div className={styles.chartSubtitle}>Income vs Expenses over time</div>
                </div>
                <span className={styles.chartBadge}>Last {data.length} months</span>
            </div>
            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <defs>
                            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                            tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            fill="url(#incomeGradient)"
                            name="Income"
                            animationDuration={2000}
                            animationEasing="ease-out"
                        />
                        <Area
                            type="monotone"
                            dataKey="expenses"
                            stroke="#f43f5e"
                            strokeWidth={2.5}
                            fill="url(#expenseGradient)"
                            name="Expenses"
                            animationDuration={2000}
                            animationBegin={500}
                            animationEasing="ease-out"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </SpotlightCard>
    );
}
