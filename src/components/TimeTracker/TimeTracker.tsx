import React from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function TimeTracker() {
  const { tasks, activeTimer, startTimer, stopTimer, currentWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();

  const workspaceTasks = tasks.filter(task => task.workspaceId === currentWorkspace?.id);

  const handleStartTimer = (taskId: string) => {
    if (!user) return;
    
    if (activeTimer) {
      toast.error('Please stop the current timer before starting a new one');
      return;
    }
    
    startTimer(taskId, user.id);
    toast.success('Timer started');
  };

  const handleStopTimer = () => {
    stopTimer();
    toast.success('Timer stopped and logged');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getCurrentTimerDuration = () => {
    if (!activeTimer) return 0;
    return Math.floor((Date.now() - activeTimer.startTime.getTime()) / 60000);
  };

  if (!currentWorkspace) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>Please select a workspace to track time</p>
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Time Tracker</h1>
        <p className="text-gray-600">Track time spent on your tasks</p>
      </div>

      {/* Active Timer */}
      {activeTimer && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-blue-900">Timer Running</h3>
              <p className="text-blue-700">
                {workspaceTasks.find(t => t.id === activeTimer.taskId)?.title}
              </p>
              <p className="text-sm text-blue-600">
                Started at {format(activeTimer.startTime, 'h:mm a')} • 
                {formatDuration(getCurrentTimerDuration())}
              </p>
            </div>
            <button
              onClick={handleStopTimer}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </button>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
        
        {workspaceTasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>No tasks available for time tracking</p>
          </div>
        ) : (
          workspaceTasks.map((task) => {
            const totalTime = task.timeEntries.reduce((total, entry) => total + (entry.duration || 0), 0);
            const isActiveTask = activeTimer?.taskId === task.id;
            
            return (
              <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Total: {formatDuration(totalTime)}</span>
                      <span className="mx-2">•</span>
                      <span className="capitalize">{task.status.replace('-', ' ')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isActiveTask ? (
                      <div className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                        Active
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartTimer(task.id)}
                        disabled={!!activeTimer}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </button>
                    )}
                  </div>
                </div>

                {/* Time Entries */}
                {task.timeEntries.length > 0 && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Time Entries</h4>
                    <div className="space-y-2">
                      {task.timeEntries.slice(-3).map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {format(entry.startTime, 'MMM d, h:mm a')}
                            {entry.endTime && ` - ${format(entry.endTime, 'h:mm a')}`}
                          </span>
                          <span className="text-gray-900 font-medium">
                            {formatDuration(entry.duration || 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}