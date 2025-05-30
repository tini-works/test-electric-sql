import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Mock data for dashboard
const mockExpenseStats = {
  totalExpenses: 125000000,
  pendingExpenses: 35000000,
  approvedExpenses: 75000000,
  rejectedExpenses: 15000000,
};

const mockInvoiceStats = {
  totalInvoices: 85000000,
  pendingInvoices: 25000000,
  approvedInvoices: 50000000,
  rejectedInvoices: 10000000,
};

const mockPaymentStats = {
  totalPayments: 65000000,
  pendingPayments: 20000000,
  completedPayments: 40000000,
  failedPayments: 5000000,
};

const mockRecentExpenses = [
  {
    id: '1',
    title: 'Office Supplies',
    amount: 2500000,
    status: 'PENDING',
    requester: 'Nguyen Van A',
    date: '2024-05-25',
  },
  {
    id: '2',
    title: 'Business Trip to Hanoi',
    amount: 5000000,
    status: 'APPROVED',
    requester: 'Tran Thi B',
    date: '2024-05-24',
  },
  {
    id: '3',
    title: 'Team Lunch',
    amount: 1500000,
    status: 'REJECTED',
    requester: 'Le Van C',
    date: '2024-05-23',
  },
  {
    id: '4',
    title: 'Software Subscription',
    amount: 3000000,
    status: 'APPROVED',
    requester: 'Pham Thi D',
    date: '2024-05-22',
  },
  {
    id: '5',
    title: 'Marketing Materials',
    amount: 4500000,
    status: 'PENDING',
    requester: 'Hoang Van E',
    date: '2024-05-21',
  },
];

const mockPendingApprovals = [
  {
    id: '1',
    title: 'Office Supplies Expense',
    type: 'EXPENSE',
    amount: 2500000,
    requester: 'Nguyen Van A',
    date: '2024-05-25',
  },
  {
    id: '2',
    title: 'Invoice #INV-2024-0125',
    type: 'INVOICE',
    amount: 15000000,
    requester: 'Finance Department',
    date: '2024-05-24',
  },
  {
    id: '3',
    title: 'Payment to Supplier XYZ',
    type: 'PAYMENT',
    amount: 10000000,
    requester: 'Finance Department',
    date: '2024-05-23',
  },
];

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [expenseStats, setExpenseStats] = useState(mockExpenseStats);
  const [invoiceStats, setInvoiceStats] = useState(mockInvoiceStats);
  const [paymentStats, setPaymentStats] = useState(mockPaymentStats);
  const [recentExpenses, setRecentExpenses] = useState(mockRecentExpenses);
  const [pendingApprovals, setPendingApprovals] = useState(mockPendingApprovals);

  // In a real application, you would fetch this data from your API
  useEffect(() => {
    // Simulating API calls
    // const fetchDashboardData = async () => {
    //   const expenseStatsResponse = await fetch('/api/stats/expenses');
    //   const expenseStatsData = await expenseStatsResponse.json();
    //   setExpenseStats(expenseStatsData);
    //
    //   const invoiceStatsResponse = await fetch('/api/stats/invoices');
    //   const invoiceStatsData = await invoiceStatsResponse.json();
    //   setInvoiceStats(invoiceStatsData);
    //
    //   const paymentStatsResponse = await fetch('/api/stats/payments');
    //   const paymentStatsData = await paymentStatsResponse.json();
    //   setPaymentStats(paymentStatsData);
    //
    //   const recentExpensesResponse = await fetch('/api/expenses/recent');
    //   const recentExpensesData = await recentExpensesResponse.json();
    //   setRecentExpenses(recentExpensesData);
    //
    //   const pendingApprovalsResponse = await fetch('/api/approvals/pending');
    //   const pendingApprovalsData = await pendingApprovalsResponse.json();
    //   setPendingApprovals(pendingApprovalsData);
    // };
    //
    // fetchDashboardData();

    // Using mock data for now
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
      default:
        return 'badge-draft';
    }
  };

  return (
    <div className="container px-4 mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {currentUser?.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Expense Stats */}
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Expenses</h2>
            <span className="material-symbols-outlined text-primary">receipt</span>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(expenseStats.totalExpenses)}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-600">Pending</p>
              <p className="text-sm font-semibold text-warning-600">{formatCurrency(expenseStats.pendingExpenses)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Approved</p>
              <p className="text-sm font-semibold text-success-600">{formatCurrency(expenseStats.approvedExpenses)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Rejected</p>
              <p className="text-sm font-semibold text-danger-600">{formatCurrency(expenseStats.rejectedExpenses)}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/expenses" className="text-sm text-primary hover:underline">View all expenses →</Link>
          </div>
        </div>

        {/* Invoice Stats */}
        {(currentUser?.role === 'FINANCE' || currentUser?.role === 'ADMIN') && (
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Invoices</h2>
              <span className="material-symbols-outlined text-primary">description</span>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(invoiceStats.totalInvoices)}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-sm font-semibold text-warning-600">{formatCurrency(invoiceStats.pendingInvoices)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Approved</p>
                <p className="text-sm font-semibold text-success-600">{formatCurrency(invoiceStats.approvedInvoices)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Rejected</p>
                <p className="text-sm font-semibold text-danger-600">{formatCurrency(invoiceStats.rejectedInvoices)}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/invoices" className="text-sm text-primary hover:underline">View all invoices →</Link>
            </div>
          </div>
        )}

        {/* Payment Stats */}
        {(currentUser?.role === 'FINANCE' || currentUser?.role === 'ADMIN') && (
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Payments</h2>
              <span className="material-symbols-outlined text-primary">payments</span>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(paymentStats.totalPayments)}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-sm font-semibold text-warning-600">{formatCurrency(paymentStats.pendingPayments)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Completed</p>
                <p className="text-sm font-semibold text-success-600">{formatCurrency(paymentStats.completedPayments)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Failed</p>
                <p className="text-sm font-semibold text-danger-600">{formatCurrency(paymentStats.failedPayments)}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/payments" className="text-sm text-primary hover:underline">View all payments →</Link>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Link
            to="/expenses/new"
            className="p-4 text-center bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <span className="material-symbols-outlined text-3xl text-primary">add_circle</span>
            <p className="mt-2 text-sm font-medium text-gray-900">New Expense</p>
          </Link>
          
          {(currentUser?.role === 'FINANCE' || currentUser?.role === 'ADMIN') && (
            <>
              <Link
                to="/invoices"
                className="p-4 text-center bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <span className="material-symbols-outlined text-3xl text-primary">upload_file</span>
                <p className="mt-2 text-sm font-medium text-gray-900">Import Invoice</p>
              </Link>
              
              <Link
                to="/payments/new"
                className="p-4 text-center bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <span className="material-symbols-outlined text-3xl text-primary">payments</span>
                <p className="mt-2 text-sm font-medium text-gray-900">New Payment</p>
              </Link>
              
              <Link
                to="/reports"
                className="p-4 text-center bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <span className="material-symbols-outlined text-3xl text-primary">summarize</span>
                <p className="mt-2 text-sm font-medium text-gray-900">Generate Report</p>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Expenses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Expenses</h2>
            <Link to="/expenses" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>
                      <Link to={`/expenses/${expense.id}`} className="text-primary hover:underline">
                        {expense.title}
                      </Link>
                    </td>
                    <td>{formatCurrency(expense.amount)}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(expense.status)}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td>{expense.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Approvals */}
        {(currentUser?.role === 'MANAGER' || currentUser?.role === 'FINANCE' || currentUser?.role === 'ADMIN') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Pending Approvals</h2>
              <Link to="/approvals" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApprovals.map((approval) => (
                    <tr key={approval.id}>
                      <td>
                        <Link 
                          to={`/${approval.type.toLowerCase()}s/${approval.id}`} 
                          className="text-primary hover:underline"
                        >
                          {approval.title}
                        </Link>
                      </td>
                      <td>{approval.type}</td>
                      <td>{formatCurrency(approval.amount)}</td>
                      <td>{approval.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

