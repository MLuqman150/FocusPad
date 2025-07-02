import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, FileText, Send, Paperclip } from "lucide-react";
import type { Message, User } from "@shared/schema";

interface ChatPanelProps {
  projectId: number;
}

export default function ChatPanel({ projectId }: ChatPanelProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['/api/projects', projectId, 'messages'],
    enabled: !!projectId,
    refetchInterval: 5000, // Refetch every 5 seconds for pseudo real-time
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { content: string; projectId: number }) => {
      await apiRequest('POST', '/api/messages', messageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'messages'] });
      setNewMessage("");
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
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    sendMessageMutation.mutate({
      content: newMessage,
      projectId,
    });
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getUserInitials = (userId: string) => {
    if (userId === user?.id) {
      return user?.firstName?.charAt(0).toUpperCase() || 'U';
    }
    // Mock other users
    const mockUsers: Record<string, string> = {
      'user2': 'S',
      'user3': 'M', 
      'user4': 'E',
    };
    return mockUsers[userId] || 'U';
  };

  const getUserName = (userId: string) => {
    if (userId === user?.id) {
      return user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || 'You';
    }
    // Mock other users
    const mockUsers: Record<string, string> = {
      'user2': 'Sarah Chen',
      'user3': 'Mike Torres',
      'user4': 'Emma Wilson',
    };
    return mockUsers[userId] || 'Unknown User';
  };

  const isClientUser = (userId: string) => {
    // Mock client detection
    return userId === 'user3';
  };

  return (
    <aside className="bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Tabs */}
      <Tabs defaultValue="chat" className="flex flex-col h-full">
        <div className="border-b border-gray-200">
          <TabsList className="w-full grid grid-cols-3 rounded-none">
            <TabsTrigger value="chat" className="text-sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="team" className="text-sm">
              <Users className="w-4 h-4 mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger value="files" className="text-sm">
              <FileText className="w-4 h-4 mr-2" />
              Files
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-0">
          {/* Chat Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : messages && messages.length > 0 ? (
              messages.map((message: Message) => (
                <div key={message.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {getUserInitials(message.userId)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {getUserName(message.userId)}
                      </span>
                      {isClientUser(message.userId) && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                          Client
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatMessageTime(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-600">Start the conversation with your team.</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
                disabled={sendMessageMutation.isPending}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button 
                type="submit" 
                size="sm"
                disabled={sendMessageMutation.isPending || !newMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="team" className="flex-1 p-4">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Team Members</h3>
            <div className="space-y-3">
              {/* Current user */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {getUserInitials(user?.id || '')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {getUserName(user?.id || '')} (You)
                  </p>
                  <p className="text-xs text-gray-500">Project Owner</p>
                </div>
              </div>
              {/* Mock team members */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">S</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Sarah Chen</p>
                  <p className="text-xs text-gray-500">Designer</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">M</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mike Torres</p>
                    <p className="text-xs text-gray-500">Client</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">Client</Badge>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">E</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Emma Wilson</p>
                  <p className="text-xs text-gray-500">Developer</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="files" className="flex-1 p-4">
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files shared yet</h3>
            <p className="text-gray-600">Files attached to messages will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
