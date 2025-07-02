import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import KanbanBoard from "@/components/kanban/kanban-board";
import ChatPanel from "@/components/chat/chat-panel";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: workspaces, isLoading: workspacesLoading } = useQuery({
    queryKey: ['/api/workspaces'],
    enabled: isAuthenticated,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/workspaces', workspaces?.[0]?.id, 'projects'],
    enabled: isAuthenticated && workspaces && workspaces.length > 0,
  });

  // Auto-select first project if available
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id);
    }
  }, [projects, selectedProject]);

  if (isLoading || workspacesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-0 ml-16">
        <TopBar 
          selectedProject={selectedProject ? projects?.find(p => p.id === selectedProject) : null}
        />
        
        <div className="flex-1 overflow-auto">
          {selectedProject ? (
            <div className="flex flex-col lg:flex-row h-full">
              <div className="flex-1 min-h-0">
                <KanbanBoard projectId={selectedProject} />
              </div>
              <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200">
                <ChatPanel projectId={selectedProject} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Welcome to TaskFlow
                </h2>
                <p className="text-gray-600 mb-8">
                  Create your first workspace and project to get started.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
