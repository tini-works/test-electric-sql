import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Mock data for expenses
const mockExpenses = [
  {
    id: '1',
    title: 'Office Supplies',
    amount: 2500000,
    category: 'Office Expenses',
    department: 'Administration',
    requester: 'Nguyen Van A',
    status: 'APPROVED',
    date: '2024-05-25',
  },
  {
    id: '2',
    title: 'Team Lunch',
    amount: 1800000,
    category: 'Meals & Entertainment',
    department: 'Marketing',
    requester: 'Tran Thi B',
    status: 'PENDING',
    date: '2024-05-24',
  },
  {
    id: '3',
    title: 'Software Subscription',
    amount: 5000000,
    category: 'Software & IT',
    department: 'IT',
    requester: 'Le Van C',
    status: 'APPROVED',
    date: '2024-05-22',
  },
  {
    id: '4',
    title: 'Travel Expenses',
    amount: 3200000,
    category: 'Travel',
    department: 'Sales',
    requester: 'Pham Thi D',
    status: 'REJECTED',
    date: '2024-05-20',
  },
  {
    id: '5',
    title: 'Conference Registration',
    amount: 4500000,
    category: 'Training & Development',
    department: 'HR',
    requester: 'Hoang Van E',
    status: 'DRAFT',
    date: '2024-05-18',
  },
  {
    id: '6',
    title: 'Client Meeting',
    amount: 1200000,
    category: 'Meals & Entertainment',
    department: 'Sales',
    requester: 'Nguyen Thi F',
    status: 'APPROVED',
    date: '2024-05-15',
  },
  {
    id: '7',
    title: 'Office Furniture',
    amount: 8500000,
    category: 'Fixed Assets',
    department: 'Administration',
    requester: 'Tran Van G',
    status: 'PENDING',
    date: '2024-05-12',
  },
  {
    id: '8',
    title: 'Marketing Campaign',
    amount: 15000000,
    category: 'Marketing',
    department: 'Marketing',
    requester: 'Le Thi H',
    status: 'APPROVED',
    date: '2024-05-10',
  },
];

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [filteredExpenses, setFilteredExpenses] = useState(mockExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // In a real application, you would fetch this data from your API
  useEffect(() => {
    // Simulating API call
    const fetchExpenses = async () => {
      // In a real app, this would be an API call
      // const response = await fetch('/api/expenses');
      // const data = await response.json();
      setExpenses(mockExpenses);
      setFilteredExpenses(mockExpenses);
    };

    fetchExpenses();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = expenses;

    if (searchTerm) {
      result = result.filter(
        (expense) =>
          expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.requester.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter((expense) => expense.status === statusFilter);
    }

    if (categoryFilter) {
      result = result.filter((expense) => expense.category === categoryFilter);
    }

    if (departmentFilter) {
      result = result.filter((expense) => expense.department === departmentFilter);
    }

    setFilteredExpenses(result);
  }, [expenses, searchTerm, statusFilter, categoryFilter, departmentFilter]);

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

  // Get unique values for filters
  const statuses = [...new Set(expenses.map((expense) => expense.status))];
  const categories = [...new Set(expenses.map((expense) => expense.category))];
  const departments = [...new Set(expenses.map((expense) => expense.department))];

  return (
    <div className="container px-4 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Manage your expense requests</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/expenses/new"
            className="btn-primary"
          >
            Create New Expense
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or requester"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              id="department"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">All Departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Department</th>
              <th>Requester</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.title}</td>
                  <td>{formatCurrency(expense.amount)}</td>
                  <td>{expense.category}</td>
                  <td>{expense.department}</td>
                  <td>{expense.requester}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-4 text-center text-gray-500">
                  No expenses found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpensesPage;

