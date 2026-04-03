'use client';

import SummaryCards from '@/components/dashboard/SummaryCards';
import BalanceTrendChart from '@/components/dashboard/BalanceTrendChart';
import SpendingBreakdown from '@/components/dashboard/SpendingBreakdown';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import styles from './page.module.css';

export default function DashboardPage() {
  return (
    <div className={styles.dashboardBento}>
      <div className={styles.summarySection}>
        <SummaryCards />
      </div>
      <div className={styles.trendSection}>
        <BalanceTrendChart />
      </div>
      <div className={styles.breakdownSection}>
        <SpendingBreakdown />
      </div>
      <div className={styles.recentSection}>
        <RecentTransactions />
      </div>
    </div>
  );
}
