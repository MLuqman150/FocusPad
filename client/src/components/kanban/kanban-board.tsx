import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import TaskCard from "./task-card";
import TaskModal from "./task-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TASK_STATUSES } from "@/lib/constants";
import type { Task } from "@shared/schema";

interface KanbanBoardProps {
  projectId: number;
}

interface DragState {
  draggedTask: Task | null;
  draggedFrom: string | null;
  dragOverColumn: string | null;
}

export default function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { toast } = useToast();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    draggedTask: null,
    draggedFrom: null,
    dragOverColumn: null,
  });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['/api/projects', projectId, 'tasks'],
    enabled: !!projectId,
  });

  const updateTaskPositionMutation = useMutation({
    mutationFn: async (updates: { id: number; position: number; status: string }[]) => {
      await apiRequest('PUT', '/api/tasks/positions', updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'tasks'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update task positions",
        variant: "destructive",
      });
    },
  });

  const getTasksByStatus = (status: string) => {
    if (!tasks) return [];
    return tasks
      .filter((task: Task) => task.status === status)
      .sort((a: Task, b: Task) => a.position - b.position);
  };

  const handleDragStart = (task: Task) => {
    setDragState({
      draggedTask: task,
      draggedFrom: task.status,
      dragOverColumn: null,
    });
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    setDragState(prev => ({ ...prev, dragOverColumn: status }));
  };

  const handleDragLeave = () => {
    setDragState(prev => ({ ...prev, dragOverColumn: null }));
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    
    if (!dragState.draggedTask || !dragState.draggedFrom) return;

    const { draggedTask, draggedFrom } = dragState;
    
    // Reset drag state
    setDragState({
      draggedTask: null,
      draggedFrom: null,
      dragOverColumn: null,
    });

    // If dropped in same column, do nothing
    if (draggedFrom === targetStatus) return;

    // Get tasks in target column
    const targetTasks = getTasksByStatus(targetStatus);
    const newPosition = targetTasks.length;

    // Update task position and status
    const updates = [{
      id: draggedTask.id,
      position: newPosition,
      status: targetStatus,
    }];

    updateTaskPositionMutation.mutate(updates);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const getColumnCount = (status: string) => {
    return getTasksByStatus(status).length;
  };

  const getColumnBadgeColor = (status: string) => {
    switch (status) {
      case TASK_STATUSES.TODO:
        return "bg-gray-100 text-gray-600";
      case TASK_STATUSES.IN_PROGRESS:
        return "bg-blue-100 text-blue-600";
      case TASK_STATUSES.DONE:
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {/* To-Do Column */}
        <div 
          className={`bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col ${
            dragState.dragOverColumn === TASK_STATUSES.TODO ? 'ring-2 ring-primary ring-opacity-50' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, TASK_STATUSES.TODO)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, TASK_STATUSES.TODO)}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">To-Do</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${getColumnBadgeColor(TASK_STATUSES.TODO)}`}>
                {getColumnCount(TASK_STATUSES.TODO)}
              </span>
            </div>
          </div>
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {getTasksByStatus(TASK_STATUSES.TODO).map((task: Task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDragStart={handleDragStart}
              />
            ))}
            <Button
              variant="outline"
              className="w-full border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
              onClick={() => setIsTaskModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* In Progress Column */}
        <div 
          className={`bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col ${
            dragState.dragOverColumn === TASK_STATUSES.IN_PROGRESS ? 'ring-2 ring-primary ring-opacity-50' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, TASK_STATUSES.IN_PROGRESS)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, TASK_STATUSES.IN_PROGRESS)}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">In Progress</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${getColumnBadgeColor(TASK_STATUSES.IN_PROGRESS)}`}>
                {getColumnCount(TASK_STATUSES.IN_PROGRESS)}
              </span>
            </div>
          </div>
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {getTasksByStatus(TASK_STATUSES.IN_PROGRESS).map((task: Task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDragStart={handleDragStart}
              />
            ))}
            <Button
              variant="outline"
              className="w-full border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
              onClick={() => setIsTaskModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Done Column */}
        <div 
          className={`bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col ${
            dragState.dragOverColumn === TASK_STATUSES.DONE ? 'ring-2 ring-primary ring-opacity-50' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, TASK_STATUSES.DONE)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, TASK_STATUSES.DONE)}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Done</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${getColumnBadgeColor(TASK_STATUSES.DONE)}`}>
                {getColumnCount(TASK_STATUSES.DONE)}
              </span>
            </div>
          </div>
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {getTasksByStatus(TASK_STATUSES.DONE).map((task: Task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDragStart={handleDragStart}
              />
            ))}
            <Button
              variant="outline"
              className="w-full border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
              onClick={() => setIsTaskModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseModal}
        projectId={projectId}
        task={editingTask}
      />
    </div>
  );
}
