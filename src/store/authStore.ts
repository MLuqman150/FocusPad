import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    // Mock login - in production, this would call your auth API
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email,
      role: 'admin',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    
    set({ user: mockUser, isAuthenticated: true });
  },
  
  loginWithGoogle: async () => {
    // Mock Google login
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john@example.com'
    };
    
    set({ user: mockUser, isAuthenticated: true });
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  register: async (name: string, email: string, password: string) => {
    // Mock registration
    const mockUser: User = {
      id: '1',
      name,
      email,
      role: 'admin',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    
    set({ user: mockUser, isAuthenticated: true });
  }
}));