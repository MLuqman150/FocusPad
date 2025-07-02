import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Play, Square, Clock } from "lucide-react";

export default function TimerWidget() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const { data: activeEntry, refetch } = useQuery({
    queryKey: ['/api/time-entries/active'],
    enabled: isAuthenticated,
    refetchInterval: 1000, // Update every second
  });

  const startTimerMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/time-entries', {
        taskId: 1, // For demo purposes, use a default task ID
        description: 'Working on current task',
        startTime: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/time-entries/active'] });
      toast({
        title: "Timer Started",
        description: "Time tracking has begun",
      });
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
        description: "Failed to start timer",
        variant: "destructive",
      });
    },
  });

  const stopTimerMutation = useMutation({
    mutationFn: async () => {
      if (!activeEntry) return;
      
      const now = new Date();
      const startTime = new Date(activeEntry.startTime);
      const duration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      
      await apiRequest('PUT', `/api/time-entries/${activeEntry.id}`, {
        endTime: now.toISOString(),
        duration,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/time-entries/active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/time-entries'] });
      toast({
        title: "Timer Stopped",
        description: "Time has been logged successfully",
      });
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
        description: "Failed to stop timer",
        variant: "destructive",
      });
    },
  });

  // Update current time display
  useEffect(() => {
    if (activeEntry) {
      const updateTimer = () => {
        const now = Date.now();
        const startTime = new Date(activeEntry.startTime).getTime();
        const totalSeconds = Math.floor((now - startTime) / 1000);
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        setCurrentTime({ hours, minutes, seconds });
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      
      return () => clearInterval(interval);
    } else {
      setCurrentTime({ hours: 0, minutes: 0, seconds: 0 });
    }
  }, [activeEntry]);

  const formatTime = (time: { hours: number; minutes: number; seconds: number }) => {
    return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    startTimerMutation.mutate();
  };

  const handleStopTimer = () => {
    stopTimerMutation.mutate();
  };

  const isRunning = !!activeEntry;
  const isLoading = startTimerMutation.isPending || stopTimerMutation.isPending;

  return (
    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
      <Clock className="w-4 h-4 text-gray-600" />
      <span className="text-sm font-medium font-mono">
        {formatTime(currentTime)}
      </span>
      {isRunning ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStopTimer}
          disabled={isLoading}
          className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Square className="w-3 h-3" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStartTimer}
          disabled={isLoading}
          className="h-6 w-6 p-0 text-green-500 hover:text-green-600 hover:bg-green-50"
        >
          <Play className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}
