export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member' | 'client';
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  members: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  assignee?: User;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  workspaceId: string;
  timeEntries: TimeEntry[];
  attachments: string[];
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  description?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  workspaceId: string;
  content: string;
  timestamp: Date;
  attachments?: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  projects: string[]; // workspace IDs
  createdAt: Date;
}