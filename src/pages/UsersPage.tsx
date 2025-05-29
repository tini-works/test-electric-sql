import { useState, useEffect } from 'react';

// Mock data for users
const mockUsers = [
  {
    id: '1',
    name: 'Nguyen Van A',
    email: 'nguyenvana@example.com',
    role: 'ADMIN',
    department: 'Administration',
    manager: null,
    isActive: true,
  },
  {
    id: '2',
    name: 'Tran Thi B',
    email: 'tranthib@example.com',
    role: 'MANAGER',
    department: 'Marketing',
    manager: 'Nguyen Van A',
    isActive: true,
  },
  {
    id: '3',
    name: 'Le Van C',
    email: 'levanc@example.com',
    role: 'FINANCE',
    department: 'Finance',
    manager: 'Nguyen Van A',
    isActive: true,
  },
  {
    id: '4',
    name: 'Pham Thi D',
    email: 'phamthid@example.com',
    role: 'EMPLOYEE',
    department: 'Sales',
    manager: 'Tran Thi B',
    isActive: true,
  },
  {
    id: '5',
    name: 'Hoang Van E',
    email: 'hoangvane@example.com',
    role: 'EMPLOYEE',
    department: 'HR',
    manager: 'Nguyen Van A',
    isActive: false,
  },
  {
    id: '6',
    name: 'Nguyen Thi F',
    email: 'nguyenthif@example.com',
    role: 'EMPLOYEE',
    department: 'Sales',
    manager: 'Tran Thi B',
    isActive: true,
  },
  {
    id: '7',
    name: 'Tran Van G',
    email: 'tranvang@example.com',
    role: 'EMPLOYEE',
    department: 'IT',
    manager: 'Le Van C',
    isActive: true,
  },
];

// Mock data for departments
const mockDepartments = [
  { id: '1', name: 'Administration' },
  { id: '2', name: 'Marketing' },
  { id: '3', name: 'Finance' },
  { id: '4', name: 'Sales' },
  { id: '5', name: 'HR' },
  { id: '6', name: 'IT' },
];

const UsersPage = () => {
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // In a real application, you would fetch this data from your API
  useEffect(() => {
    // Simulating API call
    const fetchUsers = async () => {
      // In a real app, this would be an API call
      // const response = await fetch('/api/users');
      // const data = await response.json();
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    };

    fetchUsers();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = users;

    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter) {
      result = result.filter((user) => user.role === roleFilter);
    }

    if (departmentFilter) {
      result = result.filter((user) => user.department === departmentFilter);
    }

    if (statusFilter) {
      const isActive = statusFilter === 'ACTIVE';
      result = result.filter((user) => user.isActive === isActive);
    }

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, departmentFilter, statusFilter]);

  // Handle user edit
  const handleEditUser = (user: any) => {
    setCurrentUser(user);
    setShowUserModal(true);
  };

  // Handle user create
  const handleCreateUser = () => {
    setCurrentUser(null);
    setShowUserModal(true);
  };

  // Handle user save
  const handleSaveUser = (formData: any) => {
    // In a real app, this would be an API call
    if (currentUser) {
      // Update existing user
      const updatedUsers = users.map((user) =>
        user.id === currentUser.id ? { ...user, ...formData } : user
      );
      setUsers(updatedUsers);
    } else {
      // Create new user
      const newUser = {
        id: String(users.length + 1),
        ...formData,
        isActive: true,
      };
      setUsers([...users, newUser]);
    }
    setShowUserModal(false);
  };

  // Handle user status toggle
  const handleToggleStatus = (userId: string) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    );
    setUsers(updatedUsers);
  };

  // Get unique values for filters
  const roles = [...new Set(users.map((user) => user.role))];
  const departments = [...new Set(users.map((user) => user.department))];

  return (
    <div className="container px-4 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={handleCreateUser}
            className="btn-primary"
          >
            Add New User
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
              placeholder="Search by name or email"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
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
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Manager</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.department}</td>
                  <td>{user.manager || '-'}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.isActive ? 'badge-approved' : 'badge-rejected'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-primary hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`hover:underline ${
                          user.isActive ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  No users found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-bold">
              {currentUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = {
                  name: e.currentTarget.name.value,
                  email: e.currentTarget.email.value,
                  role: e.currentTarget.role.value,
                  department: e.currentTarget.department.value,
                  manager: e.currentTarget.manager.value || null,
                };
                handleSaveUser(formData);
              }}
            >
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={currentUser?.name || ''}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={currentUser?.email || ''}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  defaultValue={currentUser?.role || ''}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Select a role</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="FINANCE">Finance</option>
                  <option value="EMPLOYEE">Employee</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  id="department"
                  name="department"
                  defaultValue={currentUser?.department || ''}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Select a department</option>
                  {mockDepartments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="manager" className="block text-sm font-medium text-gray-700">
                  Manager
                </label>
                <select
                  id="manager"
                  name="manager"
                  defaultValue={currentUser?.manager || ''}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">No Manager</option>
                  {users
                    .filter((u) => u.role === 'ADMIN' || u.role === 'MANAGER')
                    .filter((u) => u.id !== currentUser?.id)
                    .map((manager) => (
                      <option key={manager.id} value={manager.name}>
                        {manager.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {currentUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;

