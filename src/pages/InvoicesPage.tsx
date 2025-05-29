import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Mock data for invoices
const mockInvoices = [
  {
    id: '1',
    invoiceNumber: '00000052',
    supplier: 'CÔNG TY CỔ PHẦN PHÁT TRIỂN VÀ ĐẦU TƯ LONG PHƯỚC',
    amount: 33006960,
    status: 'IMPORTED',
    date: '2024-05-25',
  },
  {
    id: '2',
    invoiceNumber: '1748184',
    supplier: 'CÔNG TY TNHH GRAB',
    amount: 5996000,
    status: 'PENDING_APPROVAL',
    date: '2024-05-24',
  },
  {
    id: '3',
    invoiceNumber: '00000471',
    supplier: 'CÔNG TY CỔ PHẦN GLANZ INTERNATIONAL',
    amount: 200000,
    status: 'APPROVED',
    date: '2024-05-22',
  },
  {
    id: '4',
    invoiceNumber: '78177823',
    supplier: 'CÔNG TY CỔ PHẦN THƯƠNG MẠI BÁCH HÓA XANH',
    amount: 163017,
    status: 'PAID',
    date: '2024-05-20',
  },
  {
    id: '5',
    invoiceNumber: '1386513',
    supplier: 'CÔNG TY TNHH GRAB',
    amount: 25000,
    status: 'IMPORTED',
    date: '2024-05-18',
  },
  {
    id: '6',
    invoiceNumber: '00000123',
    supplier: 'CÔNG TY TNHH DỊCH VỤ BƯU CHÍNH VIETTEL',
    amount: 450000,
    status: 'PENDING_APPROVAL',
    date: '2024-05-15',
  },
  {
    id: '7',
    invoiceNumber: '00000789',
    supplier: 'CÔNG TY TNHH MTV ĐIỆN LỰC TP.HCM',
    amount: 3500000,
    status: 'APPROVED',
    date: '2024-05-12',
  },
  {
    id: '8',
    invoiceNumber: '00000456',
    supplier: 'CÔNG TY CỔ PHẦN CẤP NƯỚC TP.HCM',
    amount: 850000,
    status: 'PAID',
    date: '2024-05-10',
  },
];

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');

  // In a real application, you would fetch this data from your API
  useEffect(() => {
    // Simulating API call
    const fetchInvoices = async () => {
      // In a real app, this would be an API call
      // const response = await fetch('/api/invoices');
      // const data = await response.json();
      setInvoices(mockInvoices);
      setFilteredInvoices(mockInvoices);
    };

    fetchInvoices();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = invoices;

    if (searchTerm) {
      result = result.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter((invoice) => invoice.status === statusFilter);
    }

    if (supplierFilter) {
      result = result.filter((invoice) => invoice.supplier === supplierFilter);
    }

    setFilteredInvoices(result);
  }, [invoices, searchTerm, statusFilter, supplierFilter]);

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
      case 'IMPORTED':
        return 'badge-draft';
      case 'PAID':
        return 'badge-approved';
      default:
        return 'badge-draft';
    }
  };

  // Get unique values for filters
  const statuses = [...new Set(invoices.map((invoice) => invoice.status))];
  const suppliers = [...new Set(invoices.map((invoice) => invoice.supplier))];

  return (
    <div className="container px-4 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage your invoices</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            className="btn-primary"
            onClick={() => {
              // In a real app, this would trigger the e-invoice import process
              alert('This would trigger the e-invoice import process');
            }}
          >
            Import E-Invoices
          </button>
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
              placeholder="Search by invoice number or supplier"
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
                  {status.replace('_', ' ')}
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

      {/* Invoices Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Supplier</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.supplier}</td>
                  <td>{formatCurrency(invoice.amount)}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(invoice.status)}`}>
                      {invoice.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{invoice.date}</td>
                  <td>
                    <Link to={`/invoices/${invoice.id}`} className="text-primary hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  No invoices found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoicesPage;

