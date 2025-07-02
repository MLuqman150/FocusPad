import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Kanban, 
  MessageCircle, 
  FileText, 
  Clock, 
  Users, 
  Settings,
  Zap
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Tasks', href: '/tasks', icon: Kanban },
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Notes', href: '/notes', icon: FileText },
  { name: 'Time Tracker', href: '/time', icon: Clock },
  { name: 'Clients', href: '/clients', icon: Users },
];

export default function Sidebar() {
  const { currentWorkspace, workspaces, setCurrentWorkspace } = useWorkspaceStore();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="ml-2 text-xl font-bold text-gray-900">FlowSpace</span>
        </div>
      </div>

      {/* Workspace Selector */}
      <div className="px-6 py-4 border-b border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Workspace
        </label>
        <select
          value={currentWorkspace?.id || ''}
          onChange={(e) => {
            const workspace = workspaces.find(w => w.id === e.target.value);
            if (workspace) setCurrentWorkspace(workspace);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select workspace</option>
          {workspaces.map((workspace) => (
            <option key={workspace.id} value={workspace.id}>
              {workspace.name}
            </option>
          ))}
        </select>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Settings */}
      <div className="px-6 py-4 border-t border-gray-200">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </NavLink>
      </div>
    </div>
  );
}