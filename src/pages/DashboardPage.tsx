import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Mock data for the dashboard
const mockData = {
  pendingExpenses: 12,
  pendingInvoices: 8,
  pendingPayments: 5,
  recentExpenses: [
    { id: '1', title: 'Office Supplies', amount: 2500000, status: 'APPROVED', date: '2024-05-25' },
    { id: '2', title: 'Team Lunch', amount: 1800000, status: 'PENDING', date: '2024-05-24' },
    { id: '3', title: 'Software Subscription', amount: 5000000, status: 'APPROVED', date: '2024-05-22' },
    { id: '4', title: 'Travel Expenses', amount: 3200000, status: 'REJECTED', date: '2024-05-20' },
  ],
  recentInvoices: [
    { id: '1', supplier: 'VNPT', amount: 12000000, status: 'PAID', date: '2024-05-25' },
    { id: '2', title: 'Office Rent', amount: 25000000, status: 'PENDING', date: '2024-05-23' },
    { id: '3', title: 'Equipment Purchase', amount: 35000000, status: 'APPROVED', date: '2024-05-21' },
  ],
  monthlyExpenses: [
    { month: 'Jan', amount: 45000000 },
    { month: 'Feb', amount: 52000000 },
    { month: 'Mar', amount: 48000000 },
    { month: 'Apr', amount: 51000000 },
    { month: 'May', amount: 47000000 },
  ],
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(mockData);

  // In a real application, you would fetch this data from your API
  useEffect(() => {
    // Simulating API call
    const fetchDashboardData = async () => {
      // In a real app, this would be an API call
      // const response = await fetch('/api/dashboard');
      // const data = await response.json();
      setData(mockData);
    };

    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'badge-approved';
      case 'PENDING':
        return 'badge-pending';
      case 'REJECTED':
        return 'badge-rejected';
      case 'PAID':
        return 'badge-approved';
      default:
        return 'badge-draft';
    }
  };

  return (
    <div className="container px-4 mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.displayName || 'User'}!</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Pending Expenses</h2>
            <span className="text-3xl font-bold text-primary">{data.pendingExpenses}</span>
          </div>
          <Link to="/expenses" className="text-sm text-primary hover:underline">
            View all expenses →
          </Link>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Pending Invoices</h2>
            <span className="text-3xl font-bold text-primary">{data.pendingInvoices}</span>
          </div>
          <Link to="/invoices" className="text-sm text-primary hover:underline">
            View all invoices →
          </Link>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Pending Payments</h2>
            <span className="text-3xl font-bold text-primary">{data.pendingPayments}</span>
          </div>
          <Link to="/payments" className="text-sm text-primary hover:underline">
            View all payments →
          </Link>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Expenses</h2>
          <Link to="/expenses" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.recentExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.title}</td>
                  <td>{formatCurrency(expense.amount)}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(expense.status)}`}>
                      {expense.status}
                    </span>
                  </td>
                  <td>{expense.date}</td>
                  <td>
                    <Link to={`/expenses/${expense.id}`} className="text-primary hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Invoices</h2>
          <Link to="/invoices" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.recentInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.supplier}</td>
                  <td>{formatCurrency(invoice.amount)}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>{invoice.date}</td>
                  <td>
                    <Link to={`/invoices/${invoice.id}`} className="text-primary hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Expenses Chart */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Monthly Expenses</h2>
        <div className="h-64">
          <div className="flex items-end h-48 space-x-2">
            {data.monthlyExpenses.map((item) => {
              const maxAmount = Math.max(...data.monthlyExpenses.map((d) => d.amount));
              const height = (item.amount / maxAmount) * 100;
              
              return (
                <div key={item.month} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-primary rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="mt-2 text-xs font-medium text-gray-600">{item.month}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

