// category config - each has a label, chart color, and emoji
export const CATEGORIES = {
    salary: { label: 'Salary', color: '#6366f1', icon: '💼' },
    freelance: { label: 'Freelance', color: '#8b5cf6', icon: '💻' },
    investments: { label: 'Investments', color: '#06b6d4', icon: '📈' },
    groceries: { label: 'Groceries', color: '#10b981', icon: '🛒' },
    rent: { label: 'Rent', color: '#f43f5e', icon: '🏠' },
    utilities: { label: 'Utilities', color: '#f59e0b', icon: '⚡' },
    entertainment: { label: 'Entertainment', color: '#ec4899', icon: '🎬' },
    dining: { label: 'Dining', color: '#ef4444', icon: '🍕' },
    transport: { label: 'Transport', color: '#14b8a6', icon: '🚗' },
    shopping: { label: 'Shopping', color: '#a855f7', icon: '🛍️' },
    healthcare: { label: 'Healthcare', color: '#3b82f6', icon: '🏥' },
    education: { label: 'Education', color: '#0ea5e9', icon: '📚' },
    travel: { label: 'Travel', color: '#f97316', icon: '✈️' },
    subscriptions: { label: 'Subscriptions', color: '#64748b', icon: '📱' },
    gift: { label: 'Gifts', color: '#d946ef', icon: '🎁' },
};

// sample transactions across Jan-Mar 2026
export const INITIAL_TRANSACTIONS = [
    // --- january ---
    { id: 1, date: '2026-01-02', description: 'Monthly Salary', amount: 5200, type: 'income', category: 'salary' },
    { id: 2, date: '2026-01-03', description: 'Apartment Rent', amount: 1400, type: 'expense', category: 'rent' },
    { id: 3, date: '2026-01-05', description: 'Grocery Store', amount: 87.50, type: 'expense', category: 'groceries' },
    { id: 4, date: '2026-01-08', description: 'Netflix & Spotify', amount: 25.98, type: 'expense', category: 'subscriptions' },
    { id: 5, date: '2026-01-10', description: 'Electric Bill', amount: 95.00, type: 'expense', category: 'utilities' },
    { id: 6, date: '2026-01-12', description: 'Freelance Web Project', amount: 800, type: 'income', category: 'freelance' },
    { id: 7, date: '2026-01-15', description: 'Restaurant Dinner', amount: 62.40, type: 'expense', category: 'dining' },
    { id: 8, date: '2026-01-18', description: 'Gas Station', amount: 45.00, type: 'expense', category: 'transport' },
    { id: 9, date: '2026-01-22', description: 'Weekly Groceries', amount: 112.30, type: 'expense', category: 'groceries' },
    { id: 10, date: '2026-01-25', description: 'Movie Tickets', amount: 32.00, type: 'expense', category: 'entertainment' },
    { id: 11, date: '2026-01-28', description: 'Online Course', amount: 49.99, type: 'expense', category: 'education' },

    // --- february ---
    { id: 12, date: '2026-02-01', description: 'Monthly Salary', amount: 5200, type: 'income', category: 'salary' },
    { id: 13, date: '2026-02-02', description: 'Apartment Rent', amount: 1400, type: 'expense', category: 'rent' },
    { id: 14, date: '2026-02-05', description: 'Valentine\'s Gift', amount: 150.00, type: 'expense', category: 'gift' },
    { id: 15, date: '2026-02-07', description: 'Grocery Store', amount: 95.20, type: 'expense', category: 'groceries' },
    { id: 16, date: '2026-02-10', description: 'Internet Bill', amount: 65.00, type: 'expense', category: 'utilities' },
    { id: 17, date: '2026-02-12', description: 'Dividend Income', amount: 320, type: 'income', category: 'investments' },
    { id: 18, date: '2026-02-14', description: 'Fancy Restaurant', amount: 128.50, type: 'expense', category: 'dining' },
    { id: 19, date: '2026-02-17', description: 'Uber Rides', amount: 38.00, type: 'expense', category: 'transport' },
    { id: 20, date: '2026-02-20', description: 'Concert Tickets', amount: 85.00, type: 'expense', category: 'entertainment' },
    { id: 21, date: '2026-02-23', description: 'Weekly Groceries', amount: 102.75, type: 'expense', category: 'groceries' },
    { id: 22, date: '2026-02-25', description: 'Gym Membership', amount: 45.00, type: 'expense', category: 'healthcare' },
    { id: 23, date: '2026-02-28', description: 'Netflix & Spotify', amount: 25.98, type: 'expense', category: 'subscriptions' },

    // --- march ---
    { id: 24, date: '2026-03-01', description: 'Monthly Salary', amount: 5200, type: 'income', category: 'salary' },
    { id: 25, date: '2026-03-02', description: 'Apartment Rent', amount: 1400, type: 'expense', category: 'rent' },
    { id: 26, date: '2026-03-05', description: 'Grocery Store', amount: 78.90, type: 'expense', category: 'groceries' },
    { id: 27, date: '2026-03-07', description: 'Freelance Design Work', amount: 1200, type: 'income', category: 'freelance' },
    { id: 28, date: '2026-03-10', description: 'Phone Bill', amount: 55.00, type: 'expense', category: 'utilities' },
    { id: 29, date: '2026-03-12', description: 'New Sneakers', amount: 129.99, type: 'expense', category: 'shopping' },
    { id: 30, date: '2026-03-15', description: 'Brunch with Friends', amount: 48.00, type: 'expense', category: 'dining' },
    { id: 31, date: '2026-03-18', description: 'Bus Pass', amount: 75.00, type: 'expense', category: 'transport' },
    { id: 32, date: '2026-03-20', description: 'Doctor Visit', amount: 120.00, type: 'expense', category: 'healthcare' },
    { id: 33, date: '2026-03-22', description: 'Weekly Groceries', amount: 98.40, type: 'expense', category: 'groceries' },
    { id: 34, date: '2026-03-25', description: 'Video Game', amount: 59.99, type: 'expense', category: 'entertainment' },
    { id: 35, date: '2026-03-28', description: 'Netflix & Spotify', amount: 25.98, type: 'expense', category: 'subscriptions' },
    { id: 36, date: '2026-03-30', description: 'Stock Dividends', amount: 180, type: 'income', category: 'investments' },
];

export const getNextId = (transactions) => {
    return Math.max(...transactions.map(t => t.id), 0) + 1;
};
