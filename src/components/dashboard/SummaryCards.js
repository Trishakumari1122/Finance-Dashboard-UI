'use client';

import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getTotals } from '@/utils/calculations';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import SpotlightCard from '@/components/ui/SpotlightCard';
import styles from './SummaryCards.module.css';

export default function SummaryCards() {
    const { state } = useApp();
    const totals = getTotals(state.transactions);

    const cards = [
        {
            label: 'Total Balance',
            value: totals.balance,
            isCurrency: true,
            icon: Wallet,
            type: 'balance',
            footer: 'Available balance',
            trend: null,
        },
        {
            label: 'Total Income',
            value: totals.income,
            isCurrency: true,
            icon: TrendingUp,
            type: 'income',
            footer: 'All time earnings',
            trend: '+12.5%',
            trendDir: 'up',
        },
        {
            label: 'Total Expenses',
            value: totals.expenses,
            isCurrency: true,
            icon: TrendingDown,
            type: 'expenses',
            footer: 'All time spending',
            trend: '-4.2%',
            trendDir: 'down',
        },
        {
            label: 'Savings Rate',
            value: totals.savings,
            isCurrency: false,
            suffix: '%',
            icon: PiggyBank,
            type: 'savings',
            footer: 'Of total income saved',
            trend: null,
        },
    ];

    return (
        <div className={`${styles.grid} stagger-children`}>
            {cards.map((card) => (
                <SpotlightCard key={card.label} className={`${styles.card} ${styles[card.type]}`}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardLabel}>{card.label}</span>
                        <div className={`${styles.cardIcon} ${styles[card.type]}`}>
                            <card.icon size={20} />
                        </div>
                    </div>
                    <div className={styles.cardValue}>
                        <AnimatedNumber
                            value={card.value}
                            isCurrency={card.isCurrency}
                            suffix={card.suffix || ''}
                        />
                    </div>
                    <div className={styles.cardFooter}>
                        {card.trend && (
                            <span className={card.trendDir === 'up' ? styles.trendUp : styles.trendDown}>
                                {card.trend}
                            </span>
                        )}
                        <span>{card.footer}</span>
                    </div>
                </SpotlightCard>
            ))}
        </div>
    );
}
