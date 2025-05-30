import { pgTable, serial, text, timestamp, boolean, integer, json, uuid, pgEnum, jsonb, foreignKey, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['EMPLOYEE', 'MANAGER', 'FINANCE', 'ADMIN']);

export const expenseStatusEnum = pgEnum('expense_status', [
  'DRAFT',
  'PENDING',
  'APPROVED',
  'REJECTED',
  'PAID',
  'CANCELLED'
]);

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'IMPORTED',
  'PENDING_APPROVAL',
  'APPROVED',
  'REJECTED',
  'PAID',
  'CANCELLED'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'DRAFT',
  'PENDING_APPROVAL',
  'APPROVED',
  'REJECTED',
  'SENT_TO_BANK',
  'COMPLETED',
  'FAILED',
  'CANCELLED'
]);

export const notificationTypeEnum = pgEnum('notification_type', [
  'IN_APP',
  'EMAIL',
  'ZALO'
]);

export const approvalTypeEnum = pgEnum('approval_type', [
  'SEQUENTIAL',
  'PARALLEL',
  'ANY_ONE'
]);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: userRoleEnum('role').notNull().default('EMPLOYEE'),
  departmentId: uuid('department_id').references(() => departments.id),
  managerId: uuid('manager_id').references(() => users.id),
  isActive: boolean('is_active').notNull().default(true),
  avatarUrl: text('avatar_url'),
  phoneNumber: text('phone_number'),
  zaloId: text('zalo_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Departments table
export const departments = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  parentId: uuid('parent_id').references(() => departments.id),
  managerId: uuid('manager_id').references(() => users.id),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Expense Categories table
export const expenseCategories = pgTable('expense_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  description: text('description'),
  parentId: uuid('parent_id').references(() => expenseCategories.id),
  glAccountCode: text('gl_account_code'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Expense Requests table
export const expenseRequests = pgTable('expense_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  amount: integer('amount').notNull(), // Stored in smallest currency unit (e.g., cents)
  currency: text('currency').notNull().default('VND'),
  status: expenseStatusEnum('status').notNull().default('DRAFT'),
  categoryId: uuid('category_id').notNull().references(() => expenseCategories.id),
  requesterId: uuid('requester_id').notNull().references(() => users.id),
  departmentId: uuid('department_id').references(() => departments.id),
  customFields: jsonb('custom_fields'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    requesterIdx: index('expense_requester_idx').on(table.requesterId),
    departmentIdx: index('expense_department_idx').on(table.departmentId),
    categoryIdx: index('expense_category_idx').on(table.categoryId),
    statusIdx: index('expense_status_idx').on(table.status),
  }
});

// Expense Attachments table
export const expenseAttachments = pgTable('expense_attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  expenseId: uuid('expense_id').notNull().references(() => expenseRequests.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  fileUrl: text('file_url').notNull(),
  filePath: text('file_path'),
  fileSize: integer('file_size'),
  uploadedById: uuid('uploaded_by_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Approval Workflows table
export const approvalWorkflows = pgTable('approval_workflows', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  entityType: text('entity_type').notNull(), // 'EXPENSE', 'INVOICE', 'PAYMENT'
  approvalType: approvalTypeEnum('approval_type').notNull().default('SEQUENTIAL'),
  amountThreshold: integer('amount_threshold'), // Optional threshold for amount-based routing
  departmentId: uuid('department_id').references(() => departments.id), // Optional department for department-based routing
  categoryId: uuid('category_id').references(() => expenseCategories.id), // Optional category for category-based routing
  isDefault: boolean('is_default').default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Approval Steps table
export const approvalSteps = pgTable('approval_steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  workflowId: uuid('workflow_id').notNull().references(() => approvalWorkflows.id, { onDelete: 'cascade' }),
  stepNumber: integer('step_number').notNull(),
  approverType: text('approver_type').notNull(), // 'USER', 'ROLE', 'DEPARTMENT_HEAD'
  approverId: uuid('approver_id'), // User ID if approverType is 'USER'
  approverRole: userRoleEnum('approver_role'), // Role if approverType is 'ROLE'
  timeoutHours: integer('timeout_hours'),
  escalationUserId: uuid('escalation_user_id').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Approval Instances table
export const approvalInstances = pgTable('approval_instances', {
  id: uuid('id').primaryKey().defaultRandom(),
  workflowId: uuid('workflow_id').notNull().references(() => approvalWorkflows.id),
  entityId: uuid('entity_id').notNull(), // ID of the expense, invoice, or payment
  entityType: text('entity_type').notNull(), // 'EXPENSE', 'INVOICE', 'PAYMENT'
  status: text('status').notNull().default('PENDING'), // 'PENDING', 'APPROVED', 'REJECTED'
  currentStepNumber: integer('current_step_number').notNull().default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    entityIdx: index('approval_entity_idx').on(table.entityId, table.entityType),
    statusIdx: index('approval_status_idx').on(table.status),
  }
});

// Approval Actions table
export const approvalActions = pgTable('approval_actions', {
  id: uuid('id').primaryKey().defaultRandom(),
  approvalInstanceId: uuid('approval_instance_id').notNull().references(() => approvalInstances.id, { onDelete: 'cascade' }),
  stepNumber: integer('step_number').notNull(),
  approverId: uuid('approver_id').notNull().references(() => users.id),
  action: text('action').notNull(), // 'APPROVE', 'REJECT', 'DELEGATE'
  delegatedToId: uuid('delegated_to_id').references(() => users.id),
  comments: text('comments'),
  actionDate: timestamp('action_date').notNull().defaultNow(),
});

// Suppliers table
export const suppliers = pgTable('suppliers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  taxId: text('tax_id').notNull().unique(),
  address: text('address'),
  contactPerson: text('contact_person'),
  email: text('email'),
  phone: text('phone'),
  bankName: text('bank_name'),
  bankAccountNumber: text('bank_account_number'),
  bankAccountName: text('bank_account_name'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Invoices table
export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceNumber: text('invoice_number').notNull(),
  invoiceDate: timestamp('invoice_date').notNull(),
  dueDate: timestamp('due_date'),
  supplierId: uuid('supplier_id').notNull().references(() => suppliers.id),
  amount: integer('amount').notNull(), // Stored in smallest currency unit (e.g., cents)
  taxAmount: integer('tax_amount'), // VAT amount
  currency: text('currency').notNull().default('VND'),
  status: invoiceStatusEnum('status').notNull().default('IMPORTED'),
  paymentRequestId: uuid('payment_request_id').references(() => paymentRequests.id),
  eInvoiceData: jsonb('e_invoice_data'), // Raw data from e-invoice system
  eInvoiceProviderId: uuid('e_invoice_provider_id').references(() => eInvoiceProviders.id),
  eInvoiceUrl: text('e_invoice_url'), // URL to view the original e-invoice
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    supplierIdx: index('invoice_supplier_idx').on(table.supplierId),
    statusIdx: index('invoice_status_idx').on(table.status),
    invoiceNumberIdx: index('invoice_number_idx').on(table.invoiceNumber),
  }
});

// Invoice Line Items table
export const invoiceLineItems = pgTable('invoice_line_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceId: uuid('invoice_id').notNull().references(() => invoices.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: integer('unit_price').notNull(), // Stored in smallest currency unit
  taxRate: integer('tax_rate'),
  amount: integer('amount').notNull(), // Stored in smallest currency unit
  categoryId: uuid('category_id').references(() => expenseCategories.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// E-Invoice Providers table
export const eInvoiceProviders = pgTable('e_invoice_providers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(), // e.g., 'VNPT', 'VIETTEL', 'MISA'
  apiEndpoint: text('api_endpoint'),
  apiKey: text('api_key'),
  username: text('username'),
  password: text('password'),
  isActive: boolean('is_active').notNull().default(true),
  extractionRules: jsonb('extraction_rules'), // JSON configuration for data extraction
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Banks table
export const banks = pgTable('banks', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  swiftCode: text('swift_code'),
  apiEndpoint: text('api_endpoint'),
  apiCredentials: jsonb('api_credentials'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Company Bank Accounts table
export const companyBankAccounts = pgTable('company_bank_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  bankId: uuid('bank_id').notNull().references(() => banks.id),
  accountNumber: text('account_number').notNull().unique(),
  accountName: text('account_name').notNull(),
  currency: text('currency').notNull().default('VND'),
  isDefault: boolean('is_default').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Payment Requests table
export const paymentRequests = pgTable('payment_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  amount: integer('amount').notNull(), // Stored in smallest currency unit
  currency: text('currency').notNull().default('VND'),
  status: paymentStatusEnum('status').notNull().default('DRAFT'),
  supplierId: uuid('supplier_id').notNull().references(() => suppliers.id),
  requesterId: uuid('requester_id').notNull().references(() => users.id),
  paymentDate: timestamp('payment_date'),
  bankAccountId: uuid('bank_account_id').references(() => companyBankAccounts.id),
  recipientBankName: text('recipient_bank_name'),
  recipientAccountNumber: text('recipient_account_number'),
  recipientAccountName: text('recipient_account_name'),
  paymentReference: text('payment_reference'),
  bankSubmissionId: text('bank_submission_id'), // Reference ID from bank after submission
  bankSubmissionDate: timestamp('bank_submission_date'),
  bankSubmissionStatus: text('bank_submission_status'),
  bankSubmissionResponse: jsonb('bank_submission_response'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    requesterIdx: index('payment_requester_idx').on(table.requesterId),
    supplierIdx: index('payment_supplier_idx').on(table.supplierId),
    statusIdx: index('payment_status_idx').on(table.status),
  }
});

// Bank Transactions table
export const bankTransactions = pgTable('bank_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  bankAccountId: uuid('bank_account_id').notNull().references(() => companyBankAccounts.id),
  transactionDate: timestamp('transaction_date').notNull(),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull().default('VND'),
  description: text('description'),
  reference: text('reference'),
  counterpartyName: text('counterparty_name'),
  counterpartyAccount: text('counterparty_account'),
  counterpartyBank: text('counterparty_bank'),
  transactionType: text('transaction_type'), // 'DEBIT', 'CREDIT'
  paymentRequestId: uuid('payment_request_id').references(() => paymentRequests.id),
  isReconciled: boolean('is_reconciled').notNull().default(false),
  importBatchId: text('import_batch_id'), // For grouping transactions imported together
  rawData: jsonb('raw_data'), // Original data from bank statement
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Notifications table
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: notificationTypeEnum('type').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  entityType: text('entity_type'), // 'EXPENSE', 'INVOICE', 'PAYMENT', 'APPROVAL'
  entityId: uuid('entity_id'), // ID of the related entity
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => {
  return {
    userIdx: index('notification_user_idx').on(table.userId),
    readIdx: index('notification_read_idx').on(table.isRead),
  }
});

// Notification Settings table
export const notificationSettings = pgTable('notification_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  eventType: text('event_type').notNull(), // 'EXPENSE_CREATED', 'APPROVAL_REQUIRED', etc.
  inApp: boolean('in_app').notNull().default(true),
  email: boolean('email').notNull().default(true),
  zalo: boolean('zalo').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    userEventIdx: uniqueIndex('user_event_idx').on(table.userId, table.eventType),
  }
});

// System Settings table
export const systemSettings = pgTable('system_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: text('category').notNull(), // 'GENERAL', 'APPROVAL', 'NOTIFICATION', 'EINVOICE'
  key: text('key').notNull(),
  value: text('value'),
  valueJson: jsonb('value_json'),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    categoryKeyIdx: uniqueIndex('category_key_idx').on(table.category, table.key),
  }
});

// Export Data Logs table
export const exportLogs = pgTable('export_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  exportType: text('export_type').notNull(), // 'ACCOUNTING', 'BANK_TRANSFER'
  fileFormat: text('file_format').notNull(), // 'CSV', 'EXCEL', 'XML'
  fileUrl: text('file_url'),
  filePath: text('file_path'),
  status: text('status').notNull(), // 'SUCCESS', 'FAILED'
  errorMessage: text('error_message'),
  filters: jsonb('filters'), // Search criteria used for the export
  recordCount: integer('record_count'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ one, many }) => ({
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
  manager: one(users, {
    fields: [users.managerId],
    references: [users.id],
  }),
  subordinates: many(users, { relationName: 'manager_subordinates' }),
  expenseRequests: many(expenseRequests),
  notifications: many(notifications),
  notificationSettings: many(notificationSettings),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  parent: one(departments, {
    fields: [departments.parentId],
    references: [departments.id],
  }),
  children: many(departments, { relationName: 'parent_children' }),
  manager: one(users, {
    fields: [departments.managerId],
    references: [users.id],
  }),
  users: many(users),
  expenseRequests: many(expenseRequests),
}));

export const expenseCategoriesRelations = relations(expenseCategories, ({ one, many }) => ({
  parent: one(expenseCategories, {
    fields: [expenseCategories.parentId],
    references: [expenseCategories.id],
  }),
  children: many(expenseCategories, { relationName: 'parent_children' }),
  expenseRequests: many(expenseRequests),
  invoiceLineItems: many(invoiceLineItems),
}));

export const expenseRequestsRelations = relations(expenseRequests, ({ one, many }) => ({
  requester: one(users, {
    fields: [expenseRequests.requesterId],
    references: [users.id],
  }),
  department: one(departments, {
    fields: [expenseRequests.departmentId],
    references: [departments.id],
  }),
  category: one(expenseCategories, {
    fields: [expenseRequests.categoryId],
    references: [expenseCategories.id],
  }),
  attachments: many(expenseAttachments),
  approvalInstances: many(approvalInstances, { relationName: 'expense_approvals' }),
}));

export const expenseAttachmentsRelations = relations(expenseAttachments, ({ one }) => ({
  expense: one(expenseRequests, {
    fields: [expenseAttachments.expenseId],
    references: [expenseRequests.id],
  }),
  uploadedBy: one(users, {
    fields: [expenseAttachments.uploadedById],
    references: [users.id],
  }),
}));

export const approvalWorkflowsRelations = relations(approvalWorkflows, ({ one, many }) => ({
  department: one(departments, {
    fields: [approvalWorkflows.departmentId],
    references: [departments.id],
  }),
  category: one(expenseCategories, {
    fields: [approvalWorkflows.categoryId],
    references: [expenseCategories.id],
  }),
  steps: many(approvalSteps),
  instances: many(approvalInstances),
}));

export const approvalStepsRelations = relations(approvalSteps, ({ one }) => ({
  workflow: one(approvalWorkflows, {
    fields: [approvalSteps.workflowId],
    references: [approvalWorkflows.id],
  }),
  escalationUser: one(users, {
    fields: [approvalSteps.escalationUserId],
    references: [users.id],
  }),
}));

export const approvalInstancesRelations = relations(approvalInstances, ({ one, many }) => ({
  workflow: one(approvalWorkflows, {
    fields: [approvalInstances.workflowId],
    references: [approvalWorkflows.id],
  }),
  actions: many(approvalActions),
}));

export const approvalActionsRelations = relations(approvalActions, ({ one }) => ({
  instance: one(approvalInstances, {
    fields: [approvalActions.approvalInstanceId],
    references: [approvalInstances.id],
  }),
  approver: one(users, {
    fields: [approvalActions.approverId],
    references: [users.id],
  }),
  delegatedTo: one(users, {
    fields: [approvalActions.delegatedToId],
    references: [users.id],
  }),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  invoices: many(invoices),
  paymentRequests: many(paymentRequests),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [invoices.supplierId],
    references: [suppliers.id],
  }),
  paymentRequest: one(paymentRequests, {
    fields: [invoices.paymentRequestId],
    references: [paymentRequests.id],
  }),
  eInvoiceProvider: one(eInvoiceProviders, {
    fields: [invoices.eInvoiceProviderId],
    references: [eInvoiceProviders.id],
  }),
  lineItems: many(invoiceLineItems),
  approvalInstances: many(approvalInstances, { relationName: 'invoice_approvals' }),
}));

export const invoiceLineItemsRelations = relations(invoiceLineItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceLineItems.invoiceId],
    references: [invoices.id],
  }),
  category: one(expenseCategories, {
    fields: [invoiceLineItems.categoryId],
    references: [expenseCategories.id],
  }),
}));

export const eInvoiceProvidersRelations = relations(eInvoiceProviders, ({ many }) => ({
  invoices: many(invoices),
}));

export const banksRelations = relations(banks, ({ many }) => ({
  companyAccounts: many(companyBankAccounts),
}));

export const companyBankAccountsRelations = relations(companyBankAccounts, ({ one, many }) => ({
  bank: one(banks, {
    fields: [companyBankAccounts.bankId],
    references: [banks.id],
  }),
  paymentRequests: many(paymentRequests),
  bankTransactions: many(bankTransactions),
}));

export const paymentRequestsRelations = relations(paymentRequests, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [paymentRequests.supplierId],
    references: [suppliers.id],
  }),
  requester: one(users, {
    fields: [paymentRequests.requesterId],
    references: [users.id],
  }),
  bankAccount: one(companyBankAccounts, {
    fields: [paymentRequests.bankAccountId],
    references: [companyBankAccounts.id],
  }),
  invoices: many(invoices),
  bankTransactions: many(bankTransactions),
  approvalInstances: many(approvalInstances, { relationName: 'payment_approvals' }),
}));

export const bankTransactionsRelations = relations(bankTransactions, ({ one }) => ({
  bankAccount: one(companyBankAccounts, {
    fields: [bankTransactions.bankAccountId],
    references: [companyBankAccounts.id],
  }),
  paymentRequest: one(paymentRequests, {
    fields: [bankTransactions.paymentRequestId],
    references: [paymentRequests.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const notificationSettingsRelations = relations(notificationSettings, ({ one }) => ({
  user: one(users, {
    fields: [notificationSettings.userId],
    references: [users.id],
  }),
}));

export const exportLogsRelations = relations(exportLogs, ({ one }) => ({
  user: one(users, {
    fields: [exportLogs.userId],
    references: [users.id],
  }),
}));

