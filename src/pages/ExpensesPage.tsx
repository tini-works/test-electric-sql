import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Mock data for expenses
const mockExpenses = [
  {
    id: '1',
    title: 'Office Supplies',
    description: 'Purchased office supplies for the marketing department',
    amount: 2500000,
    currency: 'VND',
    status: 'PENDING',
    category: 'Office Supplies',
    requester: 'Nguyen Van A',
    department: 'Marketing',
    createdAt: '2024-05-25',
  },
  {
    id: '2',
    title: 'Business Trip to Hanoi',
    description: 'Flight tickets and accommodation for business trip',
    amount: 5000000,
    currency: 'VND',
    status: 'APPROVED',
    category: 'Travel',
    requester: 'Tran Thi B',
    department: 'Sales',
    createdAt: '2024-05-24',
  },
  {
    id: '3',
    title: 'Team Lunch',
    description: 'Team lunch for the IT department',
    amount: 1500000,
    currency: 'VND',
    status: 'REJECTED',
    category: 'Meals',
    requester: 'Le Van C',
    department: 'IT',
    createdAt: '2024-05-23',
  },
  {
    id: '4',
    title: 'Software Subscription',
    description: 'Annual subscription for design software',
    amount: 3000000,
    currency: 'VND',
    status: 'APPROVED',
    category: 'Software',
    requester: 'Pham Thi D',
    department: 'Design',
    createdAt: '2024-05-22',
  },
  {
    id: '5',
    title: 'Marketing Materials',
    description: 'Printed brochures and flyers for marketing campaign',
    amount: 4500000,
    currency: 'VND',
    status: 'PENDING',
    category: 'Marketing',
    requester: 'Hoang Van E',
    department: 'Marketing',
    createdAt: '2024-05-21',
  },
  {
    id: '6',
    title: 'Office Furniture',
    description: 'New chairs for the meeting room',
    amount: 7500000,
    currency: 'VND',
    status: 'DRAFT',
    category: 'Furniture',
    requester: 'Nguyen Thi F',
    department: 'Administration',
    createdAt: '2024-05-20',
  },
  {
    id: '7',
    title: 'Client Meeting',
    description: 'Lunch with potential client',
    amount: 1200000,
    currency: 'VND',
    status: 'APPROVED',
    category: 'Meals',
    requester: 'Tran Van G',
    department: 'Sales',
    createdAt: '2024-05-19',
  },
  {
    id: '8',
    title: 'Training Course',
    description: 'Professional development course for finance team',
    amount: 8000000,
    currency: 'VND',
    status: 'PENDING',
    category: 'Training',
    requester: 'Le Thi H',
    department: 'Finance',
    createdAt: '2024-05-18',
  },
];

// Mock data for categories
const mockCategories = [
  { id: '1', name: 'Office Supplies' },
  { id: '2', name: 'Travel' },
  { id: '3', name: 'Meals' },
  { id: '4', name: 'Software' },
  { id: '5', name: 'Marketing' },
  { id: '6', name: 'Furniture' },
  { id: '7', name: 'Training' },
];

// Mock data for departments
const mockDepartments = [
  { id: '1', name: 'Marketing' },
  { id: '2', name: 'Sales' },
  { id: '3', name: 'IT' },
  { id: '4', name: 'Design' },
  { id: '5', name: 'Administration' },
  { id: '6', name: 'Finance' },
];

const ExpensesPage = () => {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState(mockExpenses);
  const [filteredExpenses, setFilteredExpenses] = useState(mockExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

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
          expense.description.toLowerCase().includes(searchTerm.toLowerCase())
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

    if (dateFilter) {
      result = result.filter((expense) => expense.createdAt.includes(dateFilter));
    }

    setFilteredExpenses(result);
  }, [expenses, searchTerm, statusFilter, categoryFilter, departmentFilter, dateFilter]);

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
              placeholder="Search by title or description"
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
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="PAID">Paid</option>
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
              {mockCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
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
              {mockDepartments.map((department) => (
                <option key={department.id} value={department.name}>
                  {department.name}
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
              <th>Status</th>
              <th>Requester</th>
              <th>Department</th>
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
                  <td>
                    <span className={`badge ${getStatusBadgeClass(expense.status)}`}>
                      {expense.status}
                    </span>
                  </td>
                  <td>{expense.requester}</td>
                  <td>{expense.department}</td>
                  <td>{expense.createdAt}</td>
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

