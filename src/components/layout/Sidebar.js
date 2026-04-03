'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, Lightbulb, TrendingUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import styles from './Sidebar.module.css';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/transactions', label: 'Transactions', icon: Receipt },
    { href: '/insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { state, dispatch } = useApp();

    const handleNavClick = () => {
        if (state.sidebarOpen) {
            dispatch({ type: 'CLOSE_SIDEBAR' });
        }
    };

    return (
        <>
            {/* overlay to close sidebar on mobile */}
            <div
                className={`sidebar-overlay ${state.sidebarOpen ? 'active' : ''}`}
                onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
            />

            <aside className={`${styles.sidebar} ${state.sidebarOpen ? styles.open : ''}`}>

                <div className={styles.brand}>
                    <div className={styles.logoIcon}>
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <div className={styles.brandName}>FinanceFlow</div>
                        <div className={styles.brandSub}>Dashboard</div>
                    </div>
                </div>


                <nav className={styles.nav}>
                    {navItems.map(item => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                                onClick={handleNavClick}
                            >
                                <span className={styles.navIcon}>
                                    <item.icon size={20} />
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>


                <div className={styles.footer}>
                    <div className={styles.roleInfo}>
                        <div className={styles.roleAvatar}>
                            {state.role === 'admin' ? 'A' : 'V'}
                        </div>
                        <div>
                            <div className={styles.roleName}>
                                {state.role === 'admin' ? 'Admin User' : 'Viewer User'}
                            </div>
                            <div className={styles.roleLabel}>{state.role.charAt(0).toUpperCase() + state.role.slice(1)} Role</div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
