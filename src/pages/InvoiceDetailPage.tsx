import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Mock invoice data
const mockInvoice = {
  id: '1',
  invoiceNumber: '00000052',
  invoiceDate: '2024-05-25',
  dueDate: '2024-06-25',
  supplier: {
    id: '1',
    name: 'CÔNG TY CỔ PHẦN PHÁT TRIỂN VÀ ĐẦU TƯ LONG PHƯỚC',
    taxId: '0123456789',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    contactPerson: 'Nguyễn Văn A',
    email: 'contact@longphuoc.com',
    phone: '0901234567',
    bankName: 'Vietcombank',
    bankAccountNumber: '1234567890',
    bankAccountName: 'CÔNG TY CỔ PHẦN PHÁT TRIỂN VÀ ĐẦU TƯ LONG PHƯỚC',
  },
  amount: 33006960,
  status: 'IMPORTED',
  lineItems: [
    {
      id: '1',
      description: 'Tiền thuê văn phòng tháng 5/2024',
      quantity: 1,
      unitPrice: 30000000,
      taxRate: 10,
      amount: 30000000,
      category: 'Office Rent',
    },
    {
      id: '2',
      description: 'Phí dịch vụ tháng 5/2024',
      quantity: 1,
      unitPrice: 3006960,
      taxRate: 10,
      amount: 3006960,
      category: 'Office Services',
    },
  ],
  paymentRequest: null,
  eInvoiceData: {
    issuer: 'CÔNG TY CỔ PHẦN PHÁT TRIỂN VÀ ĐẦU TƯ LONG PHƯỚC',
    issuerTaxId: '0123456789',
    recipient: 'CÔNG TY TNHH ABC',
    recipientTaxId: '9876543210',
    invoiceTemplate: 'AA/24E',
    invoiceSerial: '00000052',
    invoiceDate: '2024-05-25',
    paymentMethod: 'Chuyển khoản',
    notes: 'Thanh toán tiền thuê văn phòng tháng 5/2024',
  },
};

const InvoiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real application, you would fetch this data from your API
  useEffect(() => {
    // Simulating API call
    const fetchInvoice = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/invoices/${id}`);
        // const data = await response.json();
        setInvoice(mockInvoice);
      } catch (error) {
        setError('Failed to load invoice details');
        console.error('Error fetching invoice:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

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

  // Handle approve action
  const handleApprove = () => {
    // In a real app, this would be an API call
    // await fetch(`/api/invoices/${id}/approve`, { method: 'POST' });
    alert('Invoice approved!');
    setInvoice({ ...invoice, status: 'APPROVED' });
  };

  // Handle reject action
  const handleReject = () => {
    const reason = prompt('Please enter a reason for rejection:');
    if (reason) {
      // In a real app, this would be an API call
      // await fetch(`/api/invoices/${id}/reject`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reason }),
      // });
      alert('Invoice rejected!');
      setInvoice({ ...invoice, status: 'REJECTED' });
    }
  };

  // Handle create payment request
  const handleCreatePayment = () => {
    // In a real app, this would navigate to a new payment form with the invoice pre-selected
    navigate('/payments/new', { state: { invoiceId: id } });
  };

  if (loading) {
    return (
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="container px-4 mx-auto">
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-md">
          {error || 'Invoice not found'}
        </div>
        <Link to="/invoices" className="text-primary hover:underline">
          ← Back to Invoices
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto">
      <div className="mb-6">
        <Link to="/invoices" className="text-primary hover:underline">
          ← Back to Invoices
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Invoice #{invoice.invoiceNumber}
          </h1>
          <p className="text-gray-600">
            {invoice.supplier.name}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className={`badge ${getStatusBadgeClass(invoice.status)}`}>
            {invoice.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Invoice Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Number:</span>
              <span className="font-medium">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Date:</span>
              <span className="font-medium">{invoice.invoiceDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-medium">{invoice.dueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium">{formatCurrency(invoice.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status:</span>
              <span className={`badge ${getStatusBadgeClass(invoice.status)}`}>
                {invoice.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Supplier Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Supplier Name:</span>
              <span className="font-medium">{invoice.supplier.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax ID:</span>
              <span className="font-medium">{invoice.supplier.taxId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Address:</span>
              <span className="font-medium">{invoice.supplier.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contact Person:</span>
              <span className="font-medium">{invoice.supplier.contactPerson}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{invoice.supplier.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Line Items</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Tax Rate</th>
                <th>Amount</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unitPrice)}</td>
                  <td>{item.taxRate}%</td>
                  <td>{formatCurrency(item.amount)}</td>
                  <td>{item.category}</td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-50">
                <td colSpan={4} className="text-right">
                  Total:
                </td>
                <td>{formatCurrency(invoice.amount)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* E-Invoice Data */}
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">E-Invoice Data</h2>
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-600">Issuer:</p>
              <p className="font-medium">{invoice.eInvoiceData.issuer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Issuer Tax ID:</p>
              <p className="font-medium">{invoice.eInvoiceData.issuerTaxId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Recipient:</p>
              <p className="font-medium">{invoice.eInvoiceData.recipient}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Recipient Tax ID:</p>
              <p className="font-medium">{invoice.eInvoiceData.recipientTaxId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Invoice Template:</p>
              <p className="font-medium">{invoice.eInvoiceData.invoiceTemplate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Invoice Serial:</p>
              <p className="font-medium">{invoice.eInvoiceData.invoiceSerial}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Invoice Date:</p>
              <p className="font-medium">{invoice.eInvoiceData.invoiceDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Method:</p>
              <p className="font-medium">{invoice.eInvoiceData.paymentMethod}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Notes:</p>
              <p className="font-medium">{invoice.eInvoiceData.notes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3 mb-6">
        {invoice.status === 'IMPORTED' && (
          <>
            <button
              onClick={handleApprove}
              className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Reject
            </button>
          </>
        )}
        {(invoice.status === 'APPROVED' && !invoice.paymentRequest) && (
          <button
            onClick={handleCreatePayment}
            className="btn-primary"
          >
            Create Payment Request
          </button>
        )}
        {invoice.paymentRequest && (
          <Link
            to={`/payments/${invoice.paymentRequest.id}`}
            className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90"
          >
            View Payment Request
          </Link>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetailPage;

