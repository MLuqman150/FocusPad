import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";
import TimerWidget from "@/components/timer/timer-widget";

interface TopBarProps {
  selectedProject?: {
    id: number;
    name: string;
    description?: string;
  } | null;
}

export default function TopBar({ selectedProject }: TopBarProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {selectedProject?.name || "Welcome to TaskFlow"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {selectedProject?.description || "Select a project to get started"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Timer Widget */}
          <TimerWidget />
          
          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Add Task Button */}
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>
    </header>
  );
}
