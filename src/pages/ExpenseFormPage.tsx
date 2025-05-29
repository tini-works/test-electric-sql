import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDropzone } from 'react-dropzone';

// Mock data for categories and departments
const mockCategories = [
  { id: '1', name: 'Office Expenses', code: 'OE-001' },
  { id: '2', name: 'Meals & Entertainment', code: 'ME-001' },
  { id: '3', name: 'Software & IT', code: 'IT-001' },
  { id: '4', name: 'Travel', code: 'TR-001' },
  { id: '5', name: 'Training & Development', code: 'TD-001' },
  { id: '6', name: 'Marketing', code: 'MK-001' },
  { id: '7', name: 'Fixed Assets', code: 'FA-001' },
];

const mockDepartments = [
  { id: '1', name: 'Administration' },
  { id: '2', name: 'Marketing' },
  { id: '3', name: 'IT' },
  { id: '4', name: 'Sales' },
  { id: '5', name: 'HR' },
  { id: '6', name: 'Finance' },
];

// Mock expense data for editing
const mockExpense = {
  id: '1',
  title: 'Office Supplies',
  description: 'Purchase of office supplies for the marketing department',
  amount: 2500000,
  categoryId: '1',
  departmentId: '2',
  attachments: [
    { id: '1', fileName: 'receipt.jpg', fileType: 'image/jpeg', fileUrl: '#' },
  ],
  status: 'APPROVED',
};

const ExpenseFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = !!id;

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState(mockCategories);
  const [departments, setDepartments] = useState(mockDepartments);

  // Dropzone setup
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    onDrop: (acceptedFiles) => {
      const newAttachments = acceptedFiles.map((file) => ({
        file,
        fileName: file.name,
        fileType: file.type,
        fileUrl: URL.createObjectURL(file),
        isNew: true,
      }));
      setAttachments([...attachments, ...newAttachments]);
    },
  });

  // Load data for edit mode
  useEffect(() => {
    if (isEditMode) {
      // In a real app, fetch the expense data from API
      // const fetchExpense = async () => {
      //   const response = await fetch(`/api/expenses/${id}`);
      //   const data = await response.json();
      //   // Set form values
      // };
      // fetchExpense();

      // Using mock data for now
      setTitle(mockExpense.title);
      setDescription(mockExpense.description);
      setAmount((mockExpense.amount / 100).toString());
      setCategoryId(mockExpense.categoryId);
      setDepartmentId(mockExpense.departmentId);
      setAttachments(mockExpense.attachments);
    }
  }, [id, isEditMode]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!title || !amount || !categoryId || !departmentId) {
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
        categoryId,
        departmentId,
        // In a real app, you would handle file uploads here
      };

      // Submit form
      if (isEditMode) {
        // Update existing expense
        // await fetch(`/api/expenses/${id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });
        console.log('Updating expense:', formData);
      } else {
        // Create new expense
        // await fetch('/api/expenses', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });
        console.log('Creating expense:', formData);
      }

      // Redirect to expenses list
      navigate('/expenses');
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

  // Remove attachment
  const handleRemoveAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  return (
    <div className="container px-4 mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Expense Request' : 'New Expense Request'}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? 'Update your expense request details'
            : 'Create a new expense request'}
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
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                id="department"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Select a department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Attachments
              </label>
              <div
                {...getRootProps()}
                className="flex flex-col items-center justify-center p-6 mt-1 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50"
              >
                <input {...getInputProps()} />
                <p className="text-sm text-gray-500">
                  Drag & drop files here, or click to select files
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supported formats: JPG, PNG, PDF
                </p>
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h3>
                <ul className="space-y-2">
                  {attachments.map((attachment, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center">
                        <span className="mr-2">📎</span>
                        <span className="text-sm">{attachment.fileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/expenses')}
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
                ? 'Update Expense'
                : 'Create Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseFormPage;

