import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Mock data for categories
const mockCategories = [
  { id: '1', name: 'Office Supplies', code: 'OS-001', parentId: null },
  { id: '2', name: 'Travel', code: 'TR-001', parentId: null },
  { id: '3', name: 'Meals', code: 'ME-001', parentId: null },
  { id: '4', name: 'Software', code: 'SW-001', parentId: null },
  { id: '5', name: 'Marketing', code: 'MK-001', parentId: null },
  { id: '6', name: 'Furniture', code: 'FU-001', parentId: null },
  { id: '7', name: 'Training', code: 'TR-002', parentId: null },
  { id: '8', name: 'Domestic Travel', code: 'TR-001-01', parentId: '2' },
  { id: '9', name: 'International Travel', code: 'TR-001-02', parentId: '2' },
  { id: '10', name: 'Office Stationery', code: 'OS-001-01', parentId: '1' },
  { id: '11', name: 'Office Equipment', code: 'OS-001-02', parentId: '1' },
];

// Mock data for departments
const mockDepartments = [
  { id: '1', name: 'Marketing', code: 'MKT' },
  { id: '2', name: 'Sales', code: 'SLS' },
  { id: '3', name: 'IT', code: 'IT' },
  { id: '4', name: 'Design', code: 'DSG' },
  { id: '5', name: 'Administration', code: 'ADM' },
  { id: '6', name: 'Finance', code: 'FIN' },
];

// Mock expense data for editing
const mockExpense = {
  id: '1',
  title: 'Office Supplies',
  description: 'Purchased office supplies for the marketing department',
  amount: 2500000,
  currency: 'VND',
  status: 'PENDING',
  categoryId: '1',
  departmentId: '1',
  attachments: [
    {
      id: '1',
      fileName: 'receipt.jpg',
      fileType: 'image/jpeg',
      fileUrl: 'https://example.com/receipt.jpg',
      fileSize: 1024 * 1024, // 1MB
    },
  ],
  customFields: {
    vendor: 'Office Depot',
    purchaseDate: '2024-05-20',
    receiptNumber: 'REC-12345',
  },
  createdAt: '2024-05-25',
};

const ExpenseFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isEditMode = !!id;

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('VND');
  const [categoryId, setCategoryId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState(mockCategories);
  const [departments, setDepartments] = useState(mockDepartments);

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
      setCurrency(mockExpense.currency);
      setCategoryId(mockExpense.categoryId);
      setDepartmentId(mockExpense.departmentId);
      setAttachments(mockExpense.attachments);
      setCustomFields(mockExpense.customFields);
    } else {
      // Set default values for new expense
      if (currentUser?.departmentId) {
        setDepartmentId(currentUser.departmentId);
      }
    }
  }, [id, isEditMode, currentUser]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: `temp-${Date.now()}-${file.name}`,
        fileName: file.name,
        fileType: file.type,
        fileUrl: URL.createObjectURL(file),
        fileSize: file.size,
        file, // Keep the actual file for upload
      }));

      setAttachments([...attachments, ...newFiles]);
    }
  };

  // Handle file removal
  const handleFileRemove = (fileId: string) => {
    setAttachments(attachments.filter((file) => file.id !== fileId));
  };

  // Handle custom field change
  const handleCustomFieldChange = (key: string, value: string) => {
    setCustomFields({
      ...customFields,
      [key]: value,
    });
  };

  // Add new custom field
  const handleAddCustomField = () => {
    const key = `field_${Object.keys(customFields).length + 1}`;
    setCustomFields({
      ...customFields,
      [key]: '',
    });
  };

  // Remove custom field
  const handleRemoveCustomField = (key: string) => {
    const { [key]: _, ...rest } = customFields;
    setCustomFields(rest);
  };

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
        currency,
        categoryId,
        departmentId,
        customFields,
      };

      // Handle file uploads
      const newAttachments = attachments.filter((file) => file.file);
      // In a real app, you would upload the files to a server
      // const uploadedFiles = await Promise.all(
      //   newAttachments.map(async (attachment) => {
      //     const formData = new FormData();
      //     formData.append('file', attachment.file);
      //     const response = await fetch('/api/uploads', {
      //       method: 'POST',
      //       body: formData,
      //     });
      //     return await response.json();
      //   })
      // );

      // Submit form
      if (isEditMode) {
        // Update existing expense
        // await fetch(`/api/expenses/${id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     ...formData,
        //     attachments: [
        //       ...attachments.filter((file) => !file.file),
        //       ...uploadedFiles,
        //     ],
        //   }),
        // });
        console.log('Updating expense:', formData);
      } else {
        // Create new expense
        // await fetch('/api/expenses', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     ...formData,
        //     attachments: uploadedFiles,
        //   }),
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

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                Amount <span className="text-red-500">*</span>
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
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              >
                <option value="VND">VND - Vietnamese Dong</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
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
                    {department.name} ({department.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Attachments
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-700">Uploaded Files</h3>
                <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                  {attachments.map((file) => (
                    <li
                      key={file.id}
                      className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                    >
                      <div className="flex items-center flex-1 w-0">
                        <span className="material-symbols-outlined flex-shrink-0 h-5 w-5 text-gray-400">
                          {file.fileType.includes('image') ? 'image' : 'description'}
                        </span>
                        <span className="ml-2 flex-1 w-0 truncate">{file.fileName}</span>
                        <span className="ml-2 flex-shrink-0 text-gray-400">
                          {formatFileSize(file.fileSize)}
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleFileRemove(file.id)}
                          className="font-medium text-danger hover:text-danger-600"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Custom Fields</h3>
                <button
                  type="button"
                  onClick={handleAddCustomField}
                  className="text-sm text-primary hover:text-primary-600"
                >
                  + Add Field
                </button>
              </div>
              {Object.keys(customFields).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(customFields).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => {
                          const newKey = e.target.value;
                          const { [key]: oldValue, ...rest } = customFields;
                          setCustomFields({
                            ...rest,
                            [newKey]: oldValue,
                          });
                        }}
                        placeholder="Field name"
                        className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleCustomFieldChange(key, e.target.value)}
                        placeholder="Field value"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomField(key)}
                        className="p-2 text-danger hover:text-danger-600"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No custom fields added yet. Click the button above to add a custom field.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              to="/expenses"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Cancel
            </Link>
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

