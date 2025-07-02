import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Paperclip, Check } from "lucide-react";
import { TASK_PRIORITIES, PRIORITY_COLORS, STATUS_COLORS, TASK_STATUSES } from "@/lib/constants";
import type { Task, User } from "@shared/schema";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDragStart: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDragStart }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const getPriorityColor = (priority: string) => {
    return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.medium;
  };

  const getStatusStyles = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.todo;
  };

  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const getProgressPercentage = () => {
    // For demo purposes, return different progress based on status
    switch (task.status) {
      case TASK_STATUSES.TODO:
        return 0;
      case TASK_STATUSES.IN_PROGRESS:
        return Math.floor(Math.random() * 70) + 20; // Random progress between 20-90%
      case TASK_STATUSES.DONE:
        return 100;
      default:
        return 0;
    }
  };

  const progressPercentage = getProgressPercentage();
  const showProgress = task.status === TASK_STATUSES.IN_PROGRESS;

  return (
    <div
      className={`rounded-lg p-4 border hover:shadow-md transition-all cursor-pointer ${
        getStatusStyles(task.status)
      } ${isDragging ? 'opacity-50 rotate-2' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm leading-tight">{task.title}</h4>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
        >
          <MoreHorizontal className="w-3 h-3" />
        </Button>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Badge 
            className={`text-white text-xs px-2 py-1 ${getPriorityColor(task.priority)}`}
          >
            {task.priority === 'high' && 'High'}
            {task.priority === 'medium' && 'Medium'}
            {task.priority === 'low' && 'Low'}
          </Badge>
          {task.dueDate && (
            <span className="text-xs text-gray-500">
              Due: {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>
        {task.assignedTo && (
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {task.assignedTo.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar for In Progress tasks */}
      {showProgress && (
        <>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{progressPercentage}% Complete</span>
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Paperclip className="w-3 h-3" />
              <span>0 files</span>
            </div>
          </div>
        </>
      )}

      {/* Completed indicator for Done tasks */}
      {task.status === TASK_STATUSES.DONE && (
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-500 text-white text-xs px-2 py-1">
            <Check className="w-3 h-3 mr-1" />
            Complete
          </Badge>
          <span className="text-xs text-gray-500">
            Completed: {formatDueDate(task.updatedAt)}
          </span>
        </div>
      )}
    </div>
  );
}
