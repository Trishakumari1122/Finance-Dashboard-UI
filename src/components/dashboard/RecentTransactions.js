'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import SpotlightCard from '@/components/ui/SpotlightCard';
import styles from './RecentTransactions.module.css';

export default function RecentTransactions() {
    const { state } = useApp();
    const recent = [...state.transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    return (
        <SpotlightCard className={styles.recentCard}>
            <div className={styles.header}>
                <div className={styles.title}>Recent Transactions</div>
                <Link href="/transactions" className={styles.viewAll}>View All →</Link>
            </div>

            {recent.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>📋</div>
                    <div className={styles.emptyText}>No transactions yet</div>
                </div>
            ) : (
                <div className={styles.list}>
                    {recent.map(tx => (
                        <div key={tx.id} className={styles.item}>
                            <div className={`${styles.itemIcon} ${styles[tx.type]}`}>
                                {CATEGORIES[tx.category]?.icon || '📦'}
                            </div>
                            <div className={styles.itemInfo}>
                                <div className={styles.itemDesc}>{tx.description}</div>
                                <div className={styles.itemDate}>{formatDate(tx.date)}</div>
                            </div>
                            <div className={`${styles.itemAmount} ${styles[tx.type]}`}>
                                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SpotlightCard>
    );
}
