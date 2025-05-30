import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Mock data for invoices
const mockInvoices = [
  {
    id: '1',
    invoiceNumber: '00000052',
    invoiceDate: '2024-05-25',
    dueDate: '2024-06-25',
    supplier: 'CÔNG TY CỔ PHẦN PHÁT TRIỂN VÀ ĐẦU TƯ LONG PHƯỚC',
    amount: 33006960,
    status: 'IMPORTED',
    eInvoiceProvider: 'VNPT',
  },
  {
    id: '2',
    invoiceNumber: '00000123',
    invoiceDate: '2024-05-24',
    dueDate: '2024-06-24',
    supplier: 'CÔNG TY TNHH MTV ĐIỆN LỰC TP.HCM',
    amount: 3500000,
    status: 'PENDING_APPROVAL',
    eInvoiceProvider: 'VNPT',
  },
  {
    id: '3',
    invoiceNumber: '00000456',
    invoiceDate: '2024-05-23',
    dueDate: '2024-06-23',
    supplier: 'CÔNG TY CỔ PHẦN CẤP NƯỚC TP.HCM',
    amount: 850000,
    status: 'APPROVED',
    eInvoiceProvider: 'VIETTEL',
  },
  {
    id: '4',
    invoiceNumber: '00000789',
    invoiceDate: '2024-05-22',
    dueDate: '2024-06-22',
    supplier: 'CÔNG TY CỔ PHẦN VIỄN THÔNG FPT',
    amount: 1200000,
    status: 'PAID',
    eInvoiceProvider: 'MISA',
  },
  {
    id: '5',
    invoiceNumber: '00000321',
    invoiceDate: '2024-05-21',
    dueDate: '2024-06-21',
    supplier: 'CÔNG TY TNHH VĂN PHÒNG PHẨM THIÊN LONG',
    amount: 2500000,
    status: 'REJECTED',
    eInvoiceProvider: 'VNPT',
  },
  {
    id: '6',
    invoiceNumber: '00000654',
    invoiceDate: '2024-05-20',
    dueDate: '2024-06-20',
    supplier: 'CÔNG TY TNHH DỊCH VỤ QUẢNG CÁO ABC',
    amount: 15000000,
    status: 'IMPORTED',
    eInvoiceProvider: 'VIETTEL',
  },
];

// Mock data for suppliers
const mockSuppliers = [
  { id: '1', name: 'CÔNG TY CỔ PHẦN PHÁT TRIỂN VÀ ĐẦU TƯ LONG PHƯỚC' },
  { id: '2', name: 'CÔNG TY TNHH MTV ĐIỆN LỰC TP.HCM' },
  { id: '3', name: 'CÔNG TY CỔ PHẦN CẤP NƯỚC TP.HCM' },
  { id: '4', name: 'CÔNG TY CỔ PHẦN VIỄN THÔNG FPT' },
  { id: '5', name: 'CÔNG TY TNHH VĂN PHÒNG PHẨM THIÊN LONG' },
  { id: '6', name: 'CÔNG TY TNHH DỊCH VỤ QUẢNG CÁO ABC' },
];

// Mock data for e-invoice providers
const mockProviders = [
  { id: '1', name: 'VNPT' },
  { id: '2', name: 'VIETTEL' },
  { id: '3', name: 'MISA' },
  { id: '4', name: 'FPT' },
];

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

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

    if (providerFilter) {
      result = result.filter((invoice) => invoice.eInvoiceProvider === providerFilter);
    }

    if (dateFilter) {
      result = result.filter((invoice) => invoice.invoiceDate.includes(dateFilter));
    }

    setFilteredInvoices(result);
  }, [invoices, searchTerm, statusFilter, supplierFilter, providerFilter, dateFilter]);

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
      case 'PAID':
        return 'badge-approved';
      default:
        return 'badge-draft';
    }
  };

  // Handle import invoice
  const handleImportInvoice = () => {
    setShowImportModal(true);
  };

  // Handle import submit
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call to import invoices
    setShowImportModal(false);
    // Show success message or refresh the list
  };

  // Handle sync with e-invoice providers
  const handleSyncEInvoices = () => {
    // In a real app, this would be an API call to sync with e-invoice providers
    alert('Syncing with e-invoice providers...');
  };

  return (
    <div className="container px-4 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage your invoices</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={handleImportInvoice}
            className="btn-primary"
          >
            Import Invoice
          </button>
          <button
            onClick={handleSyncEInvoices}
            className="btn-secondary"
          >
            Sync E-Invoices
          </button>
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
              <option value="IMPORTED">Imported</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="PAID">Paid</option>
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
              {mockSuppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.name}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
              E-Invoice Provider
            </label>
            <select
              id="provider"
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">All Providers</option>
              {mockProviders.map((provider) => (
                <option key={provider.id} value={provider.name}>
                  {provider.name}
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
              <th>Invoice Number</th>
              <th>Supplier</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Provider</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.supplier}</td>
                  <td>{invoice.invoiceDate}</td>
                  <td>{invoice.dueDate}</td>
                  <td>{formatCurrency(invoice.amount)}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(invoice.status)}`}>
                      {invoice.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{invoice.eInvoiceProvider}</td>
                  <td>
                    <Link to={`/invoices/${invoice.id}`} className="text-primary hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-4 text-center text-gray-500">
                  No invoices found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Import Invoice Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-bold">Import Invoice</h2>
            <form onSubmit={handleImportSubmit}>
              <div className="mb-4">
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
                  E-Invoice Provider <span className="text-red-500">*</span>
                </label>
                <select
                  id="provider"
                  name="provider"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Select a provider</option>
                  {mockProviders.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="invoiceFile" className="block text-sm font-medium text-gray-700">
                  Invoice File (XML or PDF) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  id="invoiceFile"
                  name="invoiceFile"
                  accept=".xml,.pdf"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;

