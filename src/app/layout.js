import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export const metadata = {
  title: 'FinanceFlow — Personal Finance Dashboard',
  description: 'Track your income, expenses, and spending patterns with an interactive finance dashboard. View transaction history, insights, and manage your financial data.',
  keywords: 'finance dashboard, personal finance, expense tracker, budget, transactions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body>
        <AppProvider>
          <div className="app-layout">
            <Sidebar />
            <div className="main-content">
              <Header />
              <main className="page-content">
                {children}
              </main>
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
