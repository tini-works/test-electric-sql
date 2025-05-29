import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Mock data for suppliers and bank accounts
const mockSuppliers = [
  { id: '1', name: 'CÔNG TY CỔ PHẦN PHÁT TRIỂN VÀ ĐẦU TƯ LONG PHƯỚC', taxId: '0123456789' },
  { id: '2', name: 'CÔNG TY TNHH MTV ĐIỆN LỰC TP.HCM', taxId: '0987654321' },
  { id: '3', name: 'CÔNG TY CỔ PHẦN CẤP NƯỚC TP.HCM', taxId: '1234567890' },
  { id: '4', name: 'CÔNG TY CỔ PHẦN VIỄN THÔNG FPT', taxId: '2345678901' },
  { id: '5', name: 'CÔNG TY TNHH VĂN PHÒNG PHẨM THIÊN LONG', taxId: '3456789012' },
  { id: '6', name: 'CÔNG TY TNHH DỊCH VỤ QUẢNG CÁO ABC', taxId: '4567890123' },
];

const mockBankAccounts = [
  { id: '1', bankName: 'Vietcombank', accountNumber: '1234567890', accountName: 'CÔNG TY TNHH ABC', currency: 'VND' },
  { id: '2', bankName: 'BIDV', accountNumber: '0987654321', accountName: 'CÔNG TY TNHH ABC', currency: 'VND' },
  { id: '3', bankName: 'Techcombank', accountNumber: '2345678901', accountName: 'CÔNG TY TNHH ABC', currency: 'VND' },
];

// Mock payment data for editing
const mockPayment = {
  id: '1',
  title: 'Office Rent Payment - May 2024',
  description: 'Payment for office rent for the month of May 2024',
  amount: 33006960,
  supplierId: '1',
  paymentDate: '2024-05-30',
  bankAccountId: '1',
  recipientBankName: 'Vietcombank',
  recipientAccountNumber: '9876543210',
  recipientAccountName: 'CÔNG TY CỔ PHẦN PHÁT TRIỂN VÀ ĐẦU TƯ LONG PHƯỚC',
  paymentReference: 'INV-00000052',
  status: 'DRAFT',
};

const PaymentFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isEditMode = !!id;

  // Get invoice ID from location state if available
  const invoiceId = location.state?.invoiceId;

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [bankAccountId, setBankAccountId] = useState('');
  const [recipientBankName, setRecipientBankName] = useState('');
  const [recipientAccountNumber, setRecipientAccountNumber] = useState('');
  const [recipientAccountName, setRecipientAccountName] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [bankAccounts, setBankAccounts] = useState(mockBankAccounts);

  // Load data for edit mode or from invoice
  useEffect(() => {
    if (isEditMode) {
      // In a real app, fetch the payment data from API
      // const fetchPayment = async () => {
      //   const response = await fetch(`/api/payments/${id}`);
      //   const data = await response.json();
      //   // Set form values
      // };
      // fetchPayment();

      // Using mock data for now
      setTitle(mockPayment.title);
      setDescription(mockPayment.description);
      setAmount((mockPayment.amount / 100).toString());
      setSupplierId(mockPayment.supplierId);
      setPaymentDate(mockPayment.paymentDate);
      setBankAccountId(mockPayment.bankAccountId);
      setRecipientBankName(mockPayment.recipientBankName);
      setRecipientAccountNumber(mockPayment.recipientAccountNumber);
      setRecipientAccountName(mockPayment.recipientAccountName);
      setPaymentReference(mockPayment.paymentReference);
    } else if (invoiceId) {
      // In a real app, fetch the invoice data to pre-fill the payment form
      // const fetchInvoice = async () => {
      //   const response = await fetch(`/api/invoices/${invoiceId}`);
      //   const data = await response.json();
      //   // Set form values based on invoice
      // };
      // fetchInvoice();

      // For now, just pre-fill with mock data
      setTitle('Payment for Invoice #00000052');
      setDescription('Payment for office rent invoice #00000052');
      setAmount('330069.60');
      setSupplierId('1');
      setPaymentDate('2024-05-30');
      setPaymentReference('INV-00000052');
    }
  }, [id, invoiceId, isEditMode]);

  // Handle supplier change
  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSupplierId = e.target.value;
    setSupplierId(selectedSupplierId);

    // In a real app, you would fetch the supplier's bank details
    // For now, just set some mock data
    if (selectedSupplierId === '1') {
      setRecipientBankName('Vietcombank');
      setRecipientAccountNumber('9876543210');
      setRecipientAccountName('CÔNG TY CỔ PHẦN PHÁT TRIỂN VÀ ĐẦU TƯ LONG PHƯỚC');
    } else {
      setRecipientBankName('');
      setRecipientAccountNumber('');
      setRecipientAccountName('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!title || !amount || !supplierId || !paymentDate || !bankAccountId || !recipientBankName || !recipientAccountNumber || !recipientAccountName) {
        throw new Error('Please fill in all required fields');
      }

      // Convert amount to number
      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // Prepare form data
      const formData = {
        title,
        description,
        amount: amountValue * 100, // Convert to smallest currency unit
        supplierId,
        paymentDate,
        bankAccountId,
        recipientBankName,
        recipientAccountNumber,
        recipientAccountName,
        paymentReference,
        invoiceId, // If payment is linked to an invoice
      };

      // Submit form
      if (isEditMode) {
        // Update existing payment
        // await fetch(`/api/payments/${id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });
        console.log('Updating payment:', formData);
      } else {
        // Create new payment
        // await fetch('/api/payments', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });
        console.log('Creating payment:', formData);
      }

      // Redirect to payments list
      navigate('/payments');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Payment Request' : 'New Payment Request'}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? 'Update your payment request details'
            : 'Create a new payment request'}
        </p>
      </div>

      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="p-6 bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
                Payment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="paymentDate"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
                Supplier <span className="text-red-500">*</span>
              </label>
              <select
                id="supplier"
                value={supplierId}
                onChange={handleSupplierChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Select a supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name} (Tax ID: {supplier.taxId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="paymentReference" className="block text-sm font-medium text-gray-700">
                Payment Reference
              </label>
              <input
                type="text"
                id="paymentReference"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="e.g., Invoice number"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Company Bank Account</h3>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700">
                Bank Account <span className="text-red-500">*</span>
              </label>
              <select
                id="bankAccount"
                value={bankAccountId}
                onChange={(e) => setBankAccountId(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Select a bank account</option>
                {bankAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.bankName} - {account.accountNumber} ({account.accountName})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Recipient Bank Account</h3>
            </div>

            <div>
              <label htmlFor="recipientBankName" className="block text-sm font-medium text-gray-700">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="recipientBankName"
                value={recipientBankName}
                onChange={(e) => setRecipientBankName(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="recipientAccountNumber" className="block text-sm font-medium text-gray-700">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="recipientAccountNumber"
                value={recipientAccountNumber}
                onChange={(e) => setRecipientAccountNumber(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="recipientAccountName" className="block text-sm font-medium text-gray-700">
                Account Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="recipientAccountName"
                value={recipientAccountName}
                onChange={(e) => setRecipientAccountName(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/payments')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading
                ? 'Saving...'
                : isEditMode
                ? 'Update Payment'
                : 'Create Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentFormPage;

