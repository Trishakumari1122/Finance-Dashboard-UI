export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount);
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
};

// short version for chart axis labels
export const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: '2-digit',
    }).format(date);
};

export const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
};

export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
