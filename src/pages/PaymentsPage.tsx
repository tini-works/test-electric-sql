import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Mock data for payments
const mockPayments = [
  {
    id: '1',
    title: 'Office Rent Payment - May 2024',
    supplier: 'CÔNG TY CỔ PHẦN PHÁT TRIỂN VÀ ĐẦU TƯ LONG PHƯỚC',
    amount: 33006960,
    status: 'PENDING_APPROVAL',
    paymentDate: '2024-05-30',
    createdAt: '2024-05-25',
  },
  {
    id: '2',
    title: 'Electricity Bill - May 2024',
    supplier: 'CÔNG TY TNHH MTV ĐIỆN LỰC TP.HCM',
    amount: 3500000,
    status: 'APPROVED',
    paymentDate: '2024-05-28',
    createdAt: '2024-05-24',
  },
  {
    id: '3',
    title: 'Water Bill - May 2024',
    supplier: 'CÔNG TY CỔ PHẦN CẤP NƯỚC TP.HCM',
    amount: 850000,
    status: 'SENT_TO_BANK',
    paymentDate: '2024-05-27',
    createdAt: '2024-05-22',
  },
  {
    id: '4',
    title: 'Internet Service - May 2024',
    supplier: 'CÔNG TY CỔ PHẦN VIỄN THÔNG FPT',
    amount: 1200000,
    status: 'COMPLETED',
    paymentDate: '2024-05-20',
    createdAt: '2024-05-18',
  },
  {
    id: '5',
    title: 'Office Supplies',
    supplier: 'CÔNG TY TNHH VĂN PHÒNG PHẨM THIÊN LONG',
    amount: 2500000,
    status: 'DRAFT',
    paymentDate: '2024-05-31',
    createdAt: '2024-05-15',
  },
  {
    id: '6',
    title: 'Marketing Services - Q2 2024',
    supplier: 'CÔNG TY TNHH DỊCH VỤ QUẢNG CÁO ABC',
    amount: 15000000,
    status: 'REJECTED',
    paymentDate: '2024-06-01',
    createdAt: '2024-05-12',
  },
];

const PaymentsPage = () => {
  const [payments, setPayments] = useState(mockPayments);
  const [filteredPayments, setFilteredPayments] = useState(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');

  // In a real application, you would fetch this data from your API
  useEffect(() => {
    // Simulating API call
    const fetchPayments = async () => {
      // In a real app, this would be an API call
      // const response = await fetch('/api/payments');
      // const data = await response.json();
      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
    };

    fetchPayments();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = payments;

    if (searchTerm) {
      result = result.filter(
        (payment) =>
          payment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter((payment) => payment.status === statusFilter);
    }

    if (supplierFilter) {
      result = result.filter((payment) => payment.supplier === supplierFilter);
    }

    setFilteredPayments(result);
  }, [payments, searchTerm, statusFilter, supplierFilter]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'badge-approved';
      case 'PENDING_APPROVAL':
        return 'badge-pending';
      case 'REJECTED':
        return 'badge-rejected';
      case 'COMPLETED':
        return 'badge-approved';
      case 'SENT_TO_BANK':
        return 'badge-approved';
      default:
        return 'badge-draft';
    }
  };

  // Get unique values for filters
  const statuses = [...new Set(payments.map((payment) => payment.status))];
  const suppliers = [...new Set(payments.map((payment) => payment.supplier))];

  return (
    <div className="container px-4 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Manage your payment requests</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/payments/new"
            className="btn-primary"
          >
            Create New Payment
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or supplier"
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
                  {status.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
              Supplier
            </label>
            <select
              id="supplier"
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">All Suppliers</option>
              {suppliers.map((supplier) => (
                <option key={supplier} value={supplier}>
                  {supplier}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Supplier</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.title}</td>
                  <td>{payment.supplier}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(payment.status)}`}>
                      {payment.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>{payment.paymentDate}</td>
                  <td>{payment.createdAt}</td>
                  <td>
                    <Link to={`/payments/${payment.id}`} className="text-primary hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  No payments found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsPage;

