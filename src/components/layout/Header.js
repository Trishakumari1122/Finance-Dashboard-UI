'use client';

import { usePathname } from 'next/navigation';
import { Menu, Sun, Moon, Shield, Eye } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import styles from './Header.module.css';

const pageTitles = {
    '/': { title: 'Dashboard', subtitle: 'Financial overview at a glance' },
    '/transactions': { title: 'Transactions', subtitle: 'Manage your financial records' },
    '/insights': { title: 'Insights', subtitle: 'Understand your spending patterns' },
};

export default function Header() {
    const pathname = usePathname();
    const { state, dispatch } = useApp();
    const { title, subtitle } = pageTitles[pathname] || pageTitles['/'];

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <button
                    className={styles.menuBtn}
                    onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
                    aria-label="Toggle menu"
                >
                    <Menu size={20} />
                </button>
                <div>
                    <h1 className={styles.pageTitle}>{title}</h1>
                    <p className={styles.pageSubtitle}>{subtitle}</p>
                </div>
            </div>

            <div className={styles.right}>
                <div className={styles.roleToggle}>
                    <span className={styles.roleIcon}>
                        {state.role === 'admin' ? <Shield size={15} /> : <Eye size={15} />}
                    </span>
                    <select
                        className={styles.roleSelect}
                        value={state.role}
                        onChange={(e) => dispatch({ type: 'SET_ROLE', payload: e.target.value })}
                        id="role-select"
                        aria-label="Select role"
                    >
                        <option value="admin">Admin</option>
                        <option value="viewer">Viewer</option>
                    </select>
                    <span className={`${styles.roleBadge} ${styles[state.role]}`}>
                        {state.role}
                    </span>
                </div>


                <button
                    className={styles.themeBtn}
                    onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
                    aria-label="Toggle theme"
                    id="theme-toggle"
                >
                    {state.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
            </div>
        </header>
    );
}
