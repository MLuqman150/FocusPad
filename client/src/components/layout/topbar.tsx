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
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 truncate">
            {selectedProject?.name || "Welcome to TaskFlow"}
          </h2>
          <p className="text-sm text-gray-500 mt-1 truncate">
            {selectedProject?.description || "Select a project to get started"}
          </p>
        </div>
        <div className="flex items-center space-x-2 lg:space-x-4 ml-4">
          {/* Timer Widget */}
          <div className="hidden sm:block">
            <TimerWidget />
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Bell className="w-5 h-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Add Task Button */}
          <Button className="hidden sm:flex">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
          <Button size="icon" className="sm:hidden">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
