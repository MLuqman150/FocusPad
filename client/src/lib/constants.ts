export const TASK_STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress', 
  DONE: 'done'
} as const;

export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

export const PROJECT_STATUSES = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
} as const;

export const INVOICE_STATUSES = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid'
} as const;

export const WORKSPACE_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member'
} as const;

export const PRIORITY_COLORS = {
  [TASK_PRIORITIES.LOW]: 'bg-gray-500',
  [TASK_PRIORITIES.MEDIUM]: 'bg-blue-500',
  [TASK_PRIORITIES.HIGH]: 'bg-yellow-500'
} as const;

export const STATUS_COLORS = {
  [TASK_STATUSES.TODO]: 'bg-gray-100 border-gray-200',
  [TASK_STATUSES.IN_PROGRESS]: 'bg-blue-50 border-blue-200',
  [TASK_STATUSES.DONE]: 'bg-green-50 border-green-200'
} as const;
