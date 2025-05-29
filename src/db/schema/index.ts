import { pgTable, serial, text, timestamp, boolean, integer, json, uuid, pgEnum } from 'drizzle-orm/pg-core';
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

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: userRoleEnum('role').notNull().default('EMPLOYEE'),
  departmentId: uuid('department_id').references(() => departments.id),
  managerId: uuid('manager_id').references(() => users.id),
  isActive: boolean('is_active').notNull().default(true),
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
  customFields: json('custom_fields'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Expense Attachments table
export const expenseAttachments = pgTable('expense_attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  expenseId: uuid('expense_id').notNull().references(() => expenseRequests.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  fileUrl: text('file_url').notNull(),
  uploadedById: uuid('uploaded_by_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Approval Workflows table
export const approvalWorkflows = pgTable('approval_workflows', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  entityType: text('entity_type').notNull(), // 'EXPENSE', 'INVOICE', 'PAYMENT'
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
  currency: text('currency').notNull().default('VND'),
  status: invoiceStatusEnum('status').notNull().default('IMPORTED'),
  paymentRequestId: uuid('payment_request_id').references(() => paymentRequests.id),
  eInvoiceData: json('e_invoice_data'), // Raw data from e-invoice system
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
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

// Banks table
export const banks = pgTable('banks', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  swiftCode: text('swift_code'),
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
  subordinates: many(users),
  expenseRequests: many(expenseRequests),
  notifications: many(notifications),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  parent: one(departments, {
    fields: [departments.parentId],
    references: [departments.id],
  }),
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
  children: many(expenseCategories),
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
}));

export const approvalWorkflowsRelations = relations(approvalWorkflows, ({ many }) => ({
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
  lineItems: many(invoiceLineItems),
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

export const banksRelations = relations(banks, ({ many }) => ({
  companyAccounts: many(companyBankAccounts),
}));

export const companyBankAccountsRelations = relations(companyBankAccounts, ({ one, many }) => ({
  bank: one(banks, {
    fields: [companyBankAccounts.bankId],
    references: [banks.id],
  }),
  paymentRequests: many(paymentRequests),
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
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

