'use client';

import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getInsights, getCategoryBreakdown } from '@/utils/calculations';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import SpotlightCard from '@/components/ui/SpotlightCard';
import styles from './page.module.css';

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

export default function InsightsPage() {
    const { state } = useApp();

    const insights = useMemo(() => getInsights(state.transactions), [state.transactions]);
    const categoryData = useMemo(() => getCategoryBreakdown(state.transactions), [state.transactions]);
    const totalExpenses = categoryData.reduce((s, c) => s + c.value, 0);

    return (
        <div className={styles.page}>
            <div className={`${styles.insightsGrid} stagger-children`}>

                <SpotlightCard className={`${styles.insightCard} ${styles.highlight}`} highlightColor="rgba(244, 63, 94, 0.06)">
                    <div className={`${styles.insightIconBg} ${styles.highlight}`}>🔥</div>
                    <div className={styles.insightLabel}>Highest Spending Category</div>
                    <div className={styles.insightValue}>
                        {insights.highestCategory?.name || 'N/A'}
                    </div>
                    <div className={styles.insightDesc}>
                        {insights.highestCategory
                            ? `${formatCurrency(insights.highestCategory.value)} spent — ${formatPercentage((insights.highestCategory.value / totalExpenses) * 100)} of total expenses`
                            : 'No expense data available'}
                    </div>
                </SpotlightCard>


                <SpotlightCard className={`${styles.insightCard} ${styles.good}`} highlightColor="rgba(16, 185, 129, 0.06)">
                    <div className={`${styles.insightIconBg} ${styles.good}`}>💰</div>
                    <div className={styles.insightLabel}>Savings Rate</div>
                    <div className={styles.insightValue}>
                        <AnimatedNumber value={insights.savingsRate} suffix="%" />
                    </div>
                    <div className={styles.insightDesc}>
                        {insights.savingsRate > 20
                            ? 'Great job! You\'re saving more than 20% of your income.'
                            : insights.savingsRate > 0
                                ? 'You\'re saving, but try to aim for at least 20%.'
                                : 'You\'re spending more than you earn. Consider budgeting.'}
                    </div>
                </SpotlightCard>


                <SpotlightCard className={`${styles.insightCard} ${styles.info}`} highlightColor="rgba(99, 102, 241, 0.06)">
                    <div className={`${styles.insightIconBg} ${styles.info}`}>📊</div>
                    <div className={styles.insightLabel}>Avg. Daily Spending</div>
                    <div className={styles.insightValue}>
                        <AnimatedNumber value={insights.avgDailySpend} isCurrency />
                    </div>
                    <div className={styles.insightDesc}>
                        Based on {insights.expenseCount} expense transactions over the recorded period.
                    </div>
                </SpotlightCard>
            </div>


            <div className={`${styles.insightsGrid} stagger-children`}>

                <SpotlightCard className={`${styles.insightCard} ${styles.highlight}`} highlightColor="rgba(244, 63, 94, 0.06)">
                    <div className={`${styles.insightIconBg} ${styles.highlight}`}>💸</div>
                    <div className={styles.insightLabel}>Largest Expense</div>
                    <div className={styles.insightValue}>
                        {insights.biggestExpense ? <AnimatedNumber value={insights.biggestExpense.amount} isCurrency /> : 'N/A'}
                    </div>
                    <div className={styles.insightDesc}>
                        {insights.biggestExpense?.description || 'No expenses recorded'}
                    </div>
                </SpotlightCard>


                <SpotlightCard className={`${styles.insightCard} ${styles.good}`} highlightColor="rgba(16, 185, 129, 0.06)">
                    <div className={`${styles.insightIconBg} ${styles.good}`}>🏆</div>
                    <div className={styles.insightLabel}>Largest Income</div>
                    <div className={styles.insightValue}>
                        {insights.biggestIncome ? <AnimatedNumber value={insights.biggestIncome.amount} isCurrency /> : 'N/A'}
                    </div>
                    <div className={styles.insightDesc}>
                        {insights.biggestIncome?.description || 'No income recorded'}
                    </div>
                </SpotlightCard>


                <SpotlightCard className={`${styles.insightCard} ${styles.info}`} highlightColor="rgba(99, 102, 241, 0.06)">
                    <div className={`${styles.insightIconBg} ${styles.info}`}>📈</div>
                    <div className={styles.insightLabel}>Expense Change (Month over Month)</div>
                    <div className={styles.insightValue}>
                        {insights.monthlyChangeExpenses !== null
                            ? <AnimatedNumber value={Math.abs(insights.monthlyChangeExpenses)} suffix="%" />
                            : 'N/A'}
                    </div>
                    {insights.monthlyChangeExpenses !== null && (
                        <span className={`${styles.insightChange} ${insights.monthlyChangeExpenses > 0 ? styles.up : styles.down}`}>
                            {insights.monthlyChangeExpenses > 0
                                ? <><ArrowUpRight size={13} /> Increased</>
                                : <><ArrowDownRight size={13} /> Decreased</>
                            }
                        </span>
                    )}
                    <div className={styles.insightDesc} style={{ marginTop: 6 }}>
                        Compared to the previous month&apos;s spending
                    </div>
                </SpotlightCard>
            </div>


            <div className={styles.twoColumns}>
                <SpotlightCard className={styles.chartSection} highlightColor="rgba(255, 255, 255, 0.04)">
                    <div className={styles.chartHeader}>
                        <div>
                            <div className={styles.chartTitle}>Monthly Comparison</div>
                            <div className={styles.chartSubtitle}>Income vs Expenses by month</div>
                        </div>
                        <span className={styles.chartBadge}>
                            {insights.monthlyTrend.length} months
                        </span>
                    </div>
                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={insights.monthlyTrend}
                                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                            >
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
                                <Legend
                                    wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }}
                                />
                                <Bar
                                    dataKey="income"
                                    name="Income"
                                    fill="#10b981"
                                    radius={[6, 6, 0, 0]}
                                    animationDuration={2000}
                                    animationEasing="ease-out"
                                />
                                <Bar
                                    dataKey="expenses"
                                    name="Expenses"
                                    fill="#f43f5e"
                                    radius={[6, 6, 0, 0]}
                                    animationDuration={2000}
                                    animationBegin={500}
                                    animationEasing="ease-out"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </SpotlightCard>


                <SpotlightCard className={styles.topCategories} highlightColor="rgba(255, 255, 255, 0.04)">
                    <div className={styles.chartHeader}>
                        <div>
                            <div className={styles.chartTitle}>Top Categories</div>
                            <div className={styles.chartSubtitle}>Where your money goes</div>
                        </div>
                    </div>
                    <div className={styles.categoryList}>
                        {categoryData.slice(0, 6).map((cat, i) => {
                            const percent = totalExpenses > 0 ? (cat.value / totalExpenses) * 100 : 0;
                            return (
                                <div key={i} className={styles.categoryItem}>
                                    <span className={styles.categoryRank}>{i + 1}</span>
                                    <span className={styles.categoryIcon}>{cat.icon}</span>
                                    <div className={styles.categoryInfo}>
                                        <div className={styles.categoryName}>{cat.name}</div>
                                        <div className={styles.categoryBarBg}>
                                            <div
                                                className={styles.categoryBar}
                                                style={{
                                                    width: `${percent}%`,
                                                    background: cat.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className={styles.categoryAmount}>{formatCurrency(cat.value)}</div>
                                        <div className={styles.categoryPercent}>{formatPercentage(percent)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SpotlightCard>
            </div>


            <div className={`${styles.insightsGrid} stagger-children`}>
                <SpotlightCard className={`${styles.insightCard} ${styles.info}`} highlightColor="rgba(99, 102, 241, 0.06)">
                    <div className={`${styles.insightIconBg} ${styles.info}`}>📋</div>
                    <div className={styles.insightLabel}>Total Transactions</div>
                    <div className={styles.insightValue}><AnimatedNumber value={insights.totalTransactions} /></div>
                    <div className={styles.insightDesc}>
                        {insights.incomeCount} income · {insights.expenseCount} expense
                    </div>
                </SpotlightCard>
                <SpotlightCard className={`${styles.insightCard} ${styles.good}`} highlightColor="rgba(16, 185, 129, 0.06)">
                    <div className={`${styles.insightIconBg} ${styles.good}`}>🏷️</div>
                    <div className={styles.insightLabel}>Categories Used</div>
                    <div className={styles.insightValue}><AnimatedNumber value={categoryData.length} /></div>
                    <div className={styles.insightDesc}>
                        Across all recorded expenses
                    </div>
                </SpotlightCard>
                <SpotlightCard className={`${styles.insightCard} ${styles.highlight}`} highlightColor="rgba(244, 63, 94, 0.06)">
                    <div className={`${styles.insightIconBg} ${styles.highlight}`}>⏱️</div>
                    <div className={styles.insightLabel}>Months Tracked</div>
                    <div className={styles.insightValue}><AnimatedNumber value={insights.monthlyTrend.length} /></div>
                    <div className={styles.insightDesc}>
                        Of financial activity recorded
                    </div>
                </SpotlightCard>
            </div>
        </div>
    );
}
