import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');

  // General Settings
  const [companyName, setCompanyName] = useState('CÔNG TY TNHH ABC');
  const [companyTaxId, setCompanyTaxId] = useState('0123456789');
  const [companyAddress, setCompanyAddress] = useState('123 Nguyễn Huệ, Quận 1, TP.HCM');
  const [companyPhone, setCompanyPhone] = useState('(028) 1234 5678');
  const [companyEmail, setCompanyEmail] = useState('contact@abc.com');
  const [defaultCurrency, setDefaultCurrency] = useState('VND');
  const [language, setLanguage] = useState('vi');

  // Approval Settings
  const [approvalThreshold, setApprovalThreshold] = useState('5000000');
  const [requireManagerApproval, setRequireManagerApproval] = useState(true);
  const [requireFinanceApproval, setRequireFinanceApproval] = useState(true);
  const [requireDirectorApproval, setRequireDirectorApproval] = useState(true);
  const [approvalTimeout, setApprovalTimeout] = useState('48');

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [zaloNotifications, setZaloNotifications] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(true);

  // E-Invoice Settings
  const [eInvoiceProvider, setEInvoiceProvider] = useState('VNPT');
  const [eInvoiceApiKey, setEInvoiceApiKey] = useState('********');
  const [eInvoiceUsername, setEInvoiceUsername] = useState('abc_company');
  const [eInvoicePassword, setEInvoicePassword] = useState('********');

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call to save settings
    alert('Settings saved successfully!');
  };

  return (
    <div className="container px-4 mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your application settings</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Settings</h2>
          </div>
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full text-left px-3 py-2 rounded-md ${
                activeTab === 'general'
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('approval')}
              className={`w-full text-left px-3 py-2 rounded-md ${
                activeTab === 'approval'
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Approval Workflows
            </button>
            <button
              onClick={() => setActiveTab('notification')}
              className={`w-full text-left px-3 py-2 rounded-md ${
                activeTab === 'notification'
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('einvoice')}
              className={`w-full text-left px-3 py-2 rounded-md ${
                activeTab === 'einvoice'
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              E-Invoice Integration
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg shadow">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* General Settings */}
              {activeTab === 'general' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">General Settings</h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="companyTaxId" className="block text-sm font-medium text-gray-700">
                        Tax ID
                      </label>
                      <input
                        type="text"
                        id="companyTaxId"
                        value={companyTaxId}
                        onChange={(e) => setCompanyTaxId(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <input
                        type="text"
                        id="companyAddress"
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="text"
                        id="companyPhone"
                        value={companyPhone}
                        onChange={(e) => setCompanyPhone(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="companyEmail"
                        value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700">
                        Default Currency
                      </label>
                      <select
                        id="defaultCurrency"
                        value={defaultCurrency}
                        onChange={(e) => setDefaultCurrency(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        <option value="VND">VND - Vietnamese Dong</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                        Language
                      </label>
                      <select
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        <option value="vi">Vietnamese</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Approval Settings */}
              {activeTab === 'approval' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Approval Workflow Settings</h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="approvalThreshold" className="block text-sm font-medium text-gray-700">
                        Approval Threshold (VND)
                      </label>
                      <input
                        type="number"
                        id="approvalThreshold"
                        value={approvalThreshold}
                        onChange={(e) => setApprovalThreshold(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Expenses above this amount require additional approval
                      </p>
                    </div>
                    <div>
                      <label htmlFor="approvalTimeout" className="block text-sm font-medium text-gray-700">
                        Approval Timeout (Hours)
                      </label>
                      <input
                        type="number"
                        id="approvalTimeout"
                        value={approvalTimeout}
                        onChange={(e) => setApprovalTimeout(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Time before approval request is escalated
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Required Approvals</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="requireManagerApproval"
                            checked={requireManagerApproval}
                            onChange={(e) => setRequireManagerApproval(e.target.checked)}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <label htmlFor="requireManagerApproval" className="ml-2 text-sm text-gray-700">
                            Require Manager Approval
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="requireFinanceApproval"
                            checked={requireFinanceApproval}
                            onChange={(e) => setRequireFinanceApproval(e.target.checked)}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <label htmlFor="requireFinanceApproval" className="ml-2 text-sm text-gray-700">
                            Require Finance Department Approval
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="requireDirectorApproval"
                            checked={requireDirectorApproval}
                            onChange={(e) => setRequireDirectorApproval(e.target.checked)}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <label htmlFor="requireDirectorApproval" className="ml-2 text-sm text-gray-700">
                            Require Director Approval for High-Value Expenses
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notification' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Notification Channels</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailNotifications"
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700">
                            Email Notifications
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="inAppNotifications"
                            checked={inAppNotifications}
                            onChange={(e) => setInAppNotifications(e.target.checked)}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <label htmlFor="inAppNotifications" className="ml-2 text-sm text-gray-700">
                            In-App Notifications
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="zaloNotifications"
                            checked={zaloNotifications}
                            onChange={(e) => setZaloNotifications(e.target.checked)}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <label htmlFor="zaloNotifications" className="ml-2 text-sm text-gray-700">
                            Zalo Notifications
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Notification Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="dailyDigest"
                            checked={dailyDigest}
                            onChange={(e) => setDailyDigest(e.target.checked)}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <label htmlFor="dailyDigest" className="ml-2 text-sm text-gray-700">
                            Send Daily Digest of Pending Approvals
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* E-Invoice Settings */}
              {activeTab === 'einvoice' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">E-Invoice Integration Settings</h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="eInvoiceProvider" className="block text-sm font-medium text-gray-700">
                        E-Invoice Provider
                      </label>
                      <select
                        id="eInvoiceProvider"
                        value={eInvoiceProvider}
                        onChange={(e) => setEInvoiceProvider(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        <option value="VNPT">VNPT Invoice</option>
                        <option value="VIETTEL">Viettel Invoice</option>
                        <option value="MISA">MISA Invoice</option>
                        <option value="FPT">FPT Invoice</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="eInvoiceApiKey" className="block text-sm font-medium text-gray-700">
                        API Key
                      </label>
                      <input
                        type="password"
                        id="eInvoiceApiKey"
                        value={eInvoiceApiKey}
                        onChange={(e) => setEInvoiceApiKey(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="eInvoiceUsername" className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        type="text"
                        id="eInvoiceUsername"
                        value={eInvoiceUsername}
                        onChange={(e) => setEInvoiceUsername(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="eInvoicePassword" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type="password"
                        id="eInvoicePassword"
                        value={eInvoicePassword}
                        onChange={(e) => setEInvoicePassword(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                        onClick={() => alert('Connection tested successfully!')}
                      >
                        Test Connection
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

