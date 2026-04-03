import { CATEGORIES } from '@/data/mockData';

// get total income, expenses, balance and savings rate
export const getTotals = (transactions) => {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    return {
        income,
        expenses,
        balance: income - expenses,
        savings: income > 0 ? ((income - expenses) / income) * 100 : 0,
    };
};

// group expenses by category for the donut chart
export const getCategoryBreakdown = (transactions) => {
    const expensesByCategory = {};

    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            if (!expensesByCategory[t.category]) {
                expensesByCategory[t.category] = 0;
            }
            expensesByCategory[t.category] += t.amount;
        });

    return Object.entries(expensesByCategory)
        .map(([key, value]) => ({
            name: CATEGORIES[key]?.label || key,
            value: Math.round(value * 100) / 100,
            color: CATEGORIES[key]?.color || '#94a3b8',
            icon: CATEGORIES[key]?.icon || '📦',
        }))
        .sort((a, b) => b.value - a.value);
};

// aggregate transactions by month for the trend chart
export const getMonthlyTrend = (transactions) => {
    const monthlyData = {};

    transactions.forEach(t => {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { income: 0, expenses: 0 };
        }

        if (t.type === 'income') {
            monthlyData[monthKey].income += t.amount;
        } else {
            monthlyData[monthKey].expenses += t.amount;
        }
    });

    let runningBalance = 0;
    return Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, data]) => {
            runningBalance += data.income - data.expenses;
            const [year, month] = key.split('-');
            const date = new Date(year, month - 1);
            const monthName = date.toLocaleString('en-US', { month: 'short' });

            return {
                month: `${monthName} ${year.slice(2)}`,
                income: Math.round(data.income * 100) / 100,
                expenses: Math.round(data.expenses * 100) / 100,
                balance: Math.round(runningBalance * 100) / 100,
            };
        });
};

// pull together all the insight data we need for the insights page
export const getInsights = (transactions) => {
    const categoryBreakdown = getCategoryBreakdown(transactions);
    const monthlyTrend = getMonthlyTrend(transactions);
    const totals = getTotals(transactions);

    const highestCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

    // find the single biggest expense and income
    const biggestExpense = transactions
        .filter(t => t.type === 'expense')
        .sort((a, b) => b.amount - a.amount)[0] || null;

    const biggestIncome = transactions
        .filter(t => t.type === 'income')
        .sort((a, b) => b.amount - a.amount)[0] || null;

    // avg daily spending (total expenses / number of days in the range)
    const dates = transactions.map(t => new Date(t.date));
    const minDate = dates.length > 0 ? new Date(Math.min(...dates)) : new Date();
    const maxDate = dates.length > 0 ? new Date(Math.max(...dates)) : new Date();
    const daySpan = Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)));
    const avgDailySpend = totals.expenses / daySpan;

    // compare last 2 months to get % change in spending
    const lastTwoMonths = monthlyTrend.slice(-2);
    let monthlyChangeExpenses = null;
    if (lastTwoMonths.length === 2) {
        const prev = lastTwoMonths[0].expenses;
        const curr = lastTwoMonths[1].expenses;
        monthlyChangeExpenses = prev > 0 ? ((curr - prev) / prev) * 100 : 0;
    }

    const expenseTransactions = transactions.filter(t => t.type === 'expense');

    return {
        highestCategory,
        biggestExpense,
        biggestIncome,
        avgDailySpend,
        savingsRate: totals.savings,
        monthlyChangeExpenses,
        totalTransactions: transactions.length,
        incomeCount: transactions.filter(t => t.type === 'income').length,
        expenseCount: expenseTransactions.length,
        categoryBreakdown,
        monthlyTrend,
        lastTwoMonths,
    };
};

// apply search, category filter, type filter, and sorting
export const filterTransactions = (transactions, filters) => {
    let result = [...transactions];

    if (filters.search) {
        const search = filters.search.toLowerCase();
        result = result.filter(t =>
            t.description.toLowerCase().includes(search) ||
            t.category.toLowerCase().includes(search)
        );
    }

    if (filters.category && filters.category !== 'all') {
        result = result.filter(t => t.category === filters.category);
    }

    if (filters.type && filters.type !== 'all') {
        result = result.filter(t => t.type === filters.type);
    }

    if (filters.sortBy) {
        result.sort((a, b) => {
            let comparison = 0;
            if (filters.sortBy === 'date') {
                comparison = new Date(a.date) - new Date(b.date);
            } else if (filters.sortBy === 'amount') {
                comparison = a.amount - b.amount;
            } else if (filters.sortBy === 'category') {
                comparison = a.category.localeCompare(b.category);
            }
            return filters.sortOrder === 'asc' ? comparison : -comparison;
        });
    } else {
        // default sort: newest first
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return result;
};

// download transactions as a CSV file
export const exportToCSV = (transactions) => {
    const headers = ['Date', 'Description', 'Amount', 'Type', 'Category'];
    const rows = transactions.map(t => [
        t.date,
        `"${t.description}"`,
        t.amount.toFixed(2),
        t.type,
        CATEGORIES[t.category]?.label || t.category,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};

// download transactions as a JSON file
export const exportToJSON = (transactions) => {
    const data = transactions.map(t => ({
        ...t,
        categoryLabel: CATEGORIES[t.category]?.label || t.category,
    }));
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
};
