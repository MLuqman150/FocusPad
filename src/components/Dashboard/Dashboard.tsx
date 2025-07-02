import React from 'react';
import { Calendar, CheckCircle, Clock, MessageCircle, Plus, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useAuthStore } from '../../store/authStore';

export default function Dashboard() {
  const { tasks, messages, notes, currentWorkspace, activeTimer } = useWorkspaceStore();
  const { user } = useAuthStore();

  const workspaceTasks = tasks.filter(task => task.workspaceId === currentWorkspace?.id);
  const workspaceMessages = messages.filter(msg => msg.workspaceId === currentWorkspace?.id);
  const workspaceNotes = notes.filter(note => note.workspaceId === currentWorkspace?.id);

  const completedTasks = workspaceTasks.filter(task => task.status === 'done');
  const inProgressTasks = workspaceTasks.filter(task => task.status === 'in-progress');
  const totalTimeLogged = workspaceTasks.reduce((total, task) => 
    total + task.timeEntries.reduce((taskTotal, entry) => taskTotal + (entry.duration || 0), 0), 0
  );

  const stats = [
    {
      name: 'Total Tasks',
      value: workspaceTasks.length,
      icon: CheckCircle,
      color: 'bg-blue-500'
    },
    {
      name: 'Completed',
      value: completedTasks.length,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      name: 'In Progress',
      value: inProgressTasks.length,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      name: 'Time Logged',
      value: `${Math.floor(totalTimeLogged / 60)}h ${totalTimeLogged % 60}m`,
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  if (!currentWorkspace) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-4">Welcome to FlowSpace!</p>
          <p>Please select or create a workspace to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name}
        </h1>
        <p className="text-gray-600 mt-2">Here's what's happening in {currentWorkspace.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Timer Alert */}
      {activeTimer && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse" />
            <div>
              <p className="font-medium text-blue-900">Timer is running</p>
              <p className="text-blue-700 text-sm">
                {workspaceTasks.find(t => t.id === activeTimer.taskId)?.title} • 
                Started at {format(activeTimer.startTime, 'h:mm a')}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </button>
          </div>
          
          {workspaceTasks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p>No tasks yet</p>
              <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm">
                Create your first task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {workspaceTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      task.status === 'done' ? 'bg-green-500' :
                      task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{task.status.replace('-', ' ')}</p>
                    </div>
                  </div>
                  {task.dueDate && (
                    <span className="text-xs text-gray-500">
                      {format(task.dueDate, 'MMM d')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Plus className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-900">New Task</span>
            </button>
            
            <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <MessageCircle className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-900">Team Chat</span>
            </button>
            
            <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Clock className="w-6 h-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-900">Time Tracker</span>
            </button>
            
            <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <Calendar className="w-6 h-6 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-orange-900">New Note</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        
        <div className="space-y-4">
          {workspaceMessages.slice(-3).map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.userId}`}
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">
                    {message.userId === user?.id ? 'You' : 'Team Member'}
                  </span>
                  {' '}sent a message
                </p>
                <p className="text-xs text-gray-500">
                  {format(message.timestamp, 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
          ))}
          
          {workspaceMessages.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}