'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    Search, Plus, Download, ArrowUpDown, ArrowUp, ArrowDown,
    Edit3, Trash2, X
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useApp } from '@/context/AppContext';
import { CATEGORIES, getNextId } from '@/data/mockData';
import { filterTransactions, exportToCSV, exportToJSON } from '@/utils/calculations';
import { formatCurrency, formatDate, capitalize } from '@/utils/formatters';
import styles from './page.module.css';

export default function TransactionsPage() {
    const { state, dispatch } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [editingTx, setEditingTx] = useState(null);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const isAdmin = state.role === 'admin';
    const { filters } = state;

    const filteredTransactions = useMemo(
        () => filterTransactions(state.transactions, filters),
        [state.transactions, filters]
    );

    const handleSort = (field) => {
        const newOrder = filters.sortBy === field && filters.sortOrder === 'desc' ? 'asc' : 'desc';
        dispatch({ type: 'SET_FILTERS', payload: { sortBy: field, sortOrder: newOrder } });
    };

    const getSortIcon = (field) => {
        if (filters.sortBy !== field) return <ArrowUpDown size={13} className={styles.sortIcon} />;
        return filters.sortOrder === 'asc'
            ? <ArrowUp size={13} className={`${styles.sortIcon} ${styles.active}`} />
            : <ArrowDown size={13} className={`${styles.sortIcon} ${styles.active}`} />;
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            dispatch({ type: 'DELETE_TRANSACTION', payload: id });
        }
    };

    const handleEdit = (tx) => {
        setEditingTx(tx);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setEditingTx(null);
        setShowModal(true);
    };

    const handleSave = (formData) => {
        if (editingTx) {
            dispatch({ type: 'EDIT_TRANSACTION', payload: { ...formData, id: editingTx.id } });
        } else {
            dispatch({ type: 'ADD_TRANSACTION', payload: { ...formData, id: getNextId(state.transactions) } });
        }
        setShowModal(false);
        setEditingTx(null);
    };

    return (
        <div className={styles.page}>
            <div className={styles.toolbar}>
                <div className={styles.searchWrapper}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search transactions..."
                        value={filters.search}
                        onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { search: e.target.value } })}
                        id="search-transactions"
                    />
                </div>

                <div className={styles.filters}>
                    <select
                        className={styles.filterSelect}
                        value={filters.category}
                        onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { category: e.target.value } })}
                        id="filter-category"
                    >
                        <option value="all">All Categories</option>
                        {Object.entries(CATEGORIES).map(([key, cat]) => (
                            <option key={key} value={key}>{cat.icon} {cat.label}</option>
                        ))}
                    </select>

                    <select
                        className={styles.filterSelect}
                        value={filters.type}
                        onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { type: e.target.value } })}
                        id="filter-type"
                    >
                        <option value="all">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>

                <div className={styles.actions}>
                    {isAdmin && (
                        <button className={styles.addBtn} onClick={handleAddNew} id="add-transaction-btn">
                            <Plus size={16} />
                            Add Transaction
                        </button>
                    )}

                    <div style={{ position: 'relative' }}>
                        <button
                            className={styles.exportBtn}
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            id="export-btn"
                        >
                            <Download size={15} />
                            Export
                        </button>
                        {showExportMenu && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: 4,
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                padding: '4px',
                                boxShadow: 'var(--shadow-lg)',
                                zIndex: 10,
                                minWidth: 120,
                            }}>
                                <button
                                    className={styles.exportBtn}
                                    style={{ width: '100%', border: 'none', justifyContent: 'flex-start' }}
                                    onClick={() => { exportToCSV(filteredTransactions); setShowExportMenu(false); }}
                                >
                                    CSV
                                </button>
                                <button
                                    className={styles.exportBtn}
                                    style={{ width: '100%', border: 'none', justifyContent: 'flex-start' }}
                                    onClick={() => { exportToJSON(filteredTransactions); setShowExportMenu(false); }}
                                >
                                    JSON
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.resultsCount}>
                Showing {filteredTransactions.length} of {state.transactions.length} transactions
            </div>


            <div className={styles.tableWrapper}>
                {filteredTransactions.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🔍</div>
                        <div className={styles.emptyTitle}>No transactions found</div>
                        <div className={styles.emptyDesc}>
                            Try adjusting your search or filter criteria to find what you&apos;re looking for.
                        </div>
                        <button
                            className={styles.resetBtn}
                            onClick={() => dispatch({ type: 'RESET_FILTERS' })}
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('date')}>
                                    <span className={styles.thContent}>Date {getSortIcon('date')}</span>
                                </th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th onClick={() => handleSort('amount')}>
                                    <span className={styles.thContent}>Amount {getSortIcon('amount')}</span>
                                </th>
                                {isAdmin && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(tx => (
                                <tr key={tx.id}>
                                    <td>{formatDate(tx.date)}</td>
                                    <td style={{ fontWeight: 500 }}>{tx.description}</td>
                                    <td>
                                        <span className={styles.categoryCell}>
                                            <span
                                                className={styles.categoryDot}
                                                style={{ background: CATEGORIES[tx.category]?.color }}
                                            />
                                            {CATEGORIES[tx.category]?.label || capitalize(tx.category)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.typeBadge} ${styles[tx.type]}`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.amount} ${styles[tx.type]}`}>
                                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td>
                                            <div className={styles.actionBtns}>
                                                <button
                                                    className={styles.actionBtn}
                                                    onClick={() => handleEdit(tx)}
                                                    aria-label="Edit transaction"
                                                >
                                                    <Edit3 size={15} />
                                                </button>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.delete}`}
                                                    onClick={() => handleDelete(tx.id)}
                                                    aria-label="Delete transaction"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>


            {showModal && (
                <TransactionModal
                    transaction={editingTx}
                    onSave={handleSave}
                    onClose={() => { setShowModal(false); setEditingTx(null); }}
                />
            )}
        </div>
    );
}

function TransactionModal({ transaction, onSave, onClose }) {
    const [form, setForm] = useState({
        date: transaction?.date || new Date().toISOString().split('T')[0],
        description: transaction?.description || '',
        amount: transaction?.amount || '',
        type: transaction?.type || 'expense',
        category: transaction?.category || 'groceries',
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.description || !form.amount || !form.date) return;
        onSave({
            ...form,
            amount: parseFloat(form.amount),
        });
    };

    const modalContent = (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        {transaction ? 'Edit Transaction' : 'Add Transaction'}
                    </h2>
                    <button className={styles.modalClose} onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Description</label>
                        <input
                            className={styles.formInput}
                            type="text"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="e.g., Grocery shopping"
                            required
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Amount ($)</label>
                            <input
                                className={styles.formInput}
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Date</label>
                            <input
                                className={styles.formInput}
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Type</label>
                            <select
                                className={styles.formInput}
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Category</label>
                            <select
                                className={styles.formInput}
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                            >
                                {Object.entries(CATEGORIES).map(([key, cat]) => (
                                    <option key={key} value={key}>{cat.icon} {cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.saveBtn}>
                            {transaction ? 'Save Changes' : 'Add Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (!mounted) return null;
    return createPortal(modalContent, document.body);
}
