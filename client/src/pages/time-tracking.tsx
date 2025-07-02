import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/sidebar";
import TimerWidget from "@/components/timer/timer-widget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Play, Square } from "lucide-react";

export default function TimeTracking() {
  const { isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: timeEntries, isLoading } = useQuery({
    queryKey: ['/api/time-entries'],
    enabled: isAuthenticated,
  });

  const { data: activeEntry } = useQuery({
    queryKey: ['/api/time-entries/active'],
    enabled: isAuthenticated,
    refetchInterval: 1000, // Update every second
  });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalHours = () => {
    if (!timeEntries) return 0;
    return timeEntries.reduce((total: number, entry: any) => {
      return total + (entry.duration || 0);
    }, 0);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-4 lg:p-6 lg:ml-0 ml-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Time Tracking</h1>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Timer Widget */}
          <div className="mb-6">
            <TimerWidget />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activeEntry ? formatDuration(Math.floor((Date.now() - new Date(activeEntry.startTime).getTime()) / 1000)) : '00:00:00'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {activeEntry ? 'Currently tracking' : 'No active session'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDuration(getTotalHours())}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time tracked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
                <Play className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDuration(getTotalHours())}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ready to invoice
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Time Entries List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Time Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : timeEntries && timeEntries.length > 0 ? (
                <div className="space-y-4">
                  {timeEntries.map((entry: any) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{entry.description || 'No description'}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(entry.startTime).toLocaleDateString()} • 
                          {new Date(entry.startTime).toLocaleTimeString()} - 
                          {entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : 'In progress'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {entry.duration ? formatDuration(entry.duration) : 'In progress'}
                        </p>
                        {entry.hourlyRate && (
                          <p className="text-sm text-gray-500">
                            ${entry.hourlyRate}/hr
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No time entries yet</h3>
                  <p className="text-gray-600">Start tracking time on your tasks to see entries here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
