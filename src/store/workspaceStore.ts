import { create } from 'zustand';
import { Workspace, Task, ChatMessage, Note, TimeEntry } from '../types';

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  tasks: Task[];
  messages: ChatMessage[];
  notes: Note[];
  activeTimer: TimeEntry | null;
  
  // Actions
  setCurrentWorkspace: (workspace: Workspace) => void;
  createWorkspace: (name: string, description?: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
  deleteTask: (taskId: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (noteId: string, updates: Partial<Note>) => void;
  startTimer: (taskId: string, userId: string) => void;
  stopTimer: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [
    {
      id: '1',
      name: 'Personal Projects',
      description: 'My personal workspace',
      members: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  currentWorkspace: null,
  tasks: [
    {
      id: '1',
      title: 'Set up project structure',
      description: 'Initialize the basic project setup and folder structure',
      status: 'done',
      createdAt: new Date(),
      updatedAt: new Date(),
      workspaceId: '1',
      timeEntries: [],
      attachments: []
    },
    {
      id: '2',
      title: 'Design user interface',
      description: 'Create wireframes and mockups for the main application interface',
      status: 'in-progress',
      createdAt: new Date(),
      updatedAt: new Date(),
      workspaceId: '1',
      timeEntries: [],
      attachments: []
    },
    {
      id: '3',
      title: 'Implement authentication',
      description: 'Add user login and registration functionality',
      status: 'todo',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      workspaceId: '1',
      timeEntries: [],
      attachments: []
    }
  ],
  messages: [],
  notes: [
    {
      id: '1',
      title: 'Project Requirements',
      content: '# Project Requirements\n\n## Core Features\n- [ ] User authentication\n- [ ] Workspace management\n- [ ] Task management\n- [ ] Real-time chat\n\n## Nice to Have\n- [ ] File sharing\n- [ ] Time tracking\n- [ ] Invoice generation',
      userId: '1',
      workspaceId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  activeTimer: null,

  setCurrentWorkspace: (workspace) => {
    set({ currentWorkspace: workspace });
  },

  createWorkspace: (name, description) => {
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name,
      description,
      members: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set((state) => ({
      workspaces: [...state.workspaces, newWorkspace]
    }));
  },

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      timeEntries: [],
      attachments: []
    };
    
    set((state) => ({
      tasks: [...state.tasks, newTask]
    }));
  },

  updateTask: (taskId, updates) => {
    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    }));
  },

  moveTask: (taskId, newStatus) => {
    get().updateTask(taskId, { status: newStatus });
  },

  deleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter(task => task.id !== taskId)
    }));
  },

  addMessage: (messageData) => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage]
    }));
  },

  addNote: (noteData) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set((state) => ({
      notes: [...state.notes, newNote]
    }));
  },

  updateNote: (noteId, updates) => {
    set((state) => ({
      notes: state.notes.map(note =>
        note.id === noteId
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      )
    }));
  },

  startTimer: (taskId, userId) => {
    const timer: TimeEntry = {
      id: Date.now().toString(),
      taskId,
      userId,
      startTime: new Date()
    };
    
    set({ activeTimer: timer });
  },

  stopTimer: () => {
    const { activeTimer, tasks } = get();
    if (!activeTimer) return;

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - activeTimer.startTime.getTime()) / 60000);
    
    const completedEntry: TimeEntry = {
      ...activeTimer,
      endTime,
      duration
    };

    // Add time entry to the corresponding task
    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === activeTimer.taskId
          ? { ...task, timeEntries: [...task.timeEntries, completedEntry] }
          : task
      ),
      activeTimer: null
    }));
  }
}));