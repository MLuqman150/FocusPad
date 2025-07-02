import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Calendar, User, Clock, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Task } from '../../types';
import TaskModal from './TaskModal';

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' }
];

export default function KanbanBoard() {
  const { tasks, moveTask, currentWorkspace } = useWorkspaceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const workspaceTasks = tasks.filter(task => task.workspaceId === currentWorkspace?.id);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as Task['status'];
    
    moveTask(taskId, newStatus);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleNewTask = (status: Task['status']) => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  return (
    <div className="h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
        <p className="text-gray-600">Manage your tasks with drag and drop</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${column.color} mr-2`} />
                  <h2 className="font-semibold text-gray-900">{column.title}</h2>
                  <span className="ml-2 text-sm text-gray-500">
                    {workspaceTasks.filter(task => task.status === column.id).length}
                  </span>
                </div>
                <button
                  onClick={() => handleNewTask(column.id as Task['status'])}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 space-y-3 p-2 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? 'bg-gray-50' : ''
                    }`}
                  >
                    {workspaceTasks
                      .filter(task => task.status === column.id)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => handleTaskClick(task)}
                              className={`bg-white p-4 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                                snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-medium text-gray-900 text-sm leading-tight">
                                  {task.title}
                                </h3>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>
                              
                              {task.description && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {task.description}
                                </p>
                              )}

                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center space-x-3">
                                  {task.dueDate && (
                                    <div className="flex items-center">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      <span>{format(task.dueDate, 'MMM d')}</span>
                                    </div>
                                  )}
                                  
                                  {task.assignee && (
                                    <div className="flex items-center">
                                      <User className="w-3 h-3 mr-1" />
                                      <span>{task.assignee.name}</span>
                                    </div>
                                  )}
                                </div>

                                {task.timeEntries.length > 0 && (
                                  <div className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    <span>
                                      {task.timeEntries.reduce((total, entry) => total + (entry.duration || 0), 0)}m
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}