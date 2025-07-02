import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Users, FileText, DollarSign, MessageSquare } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">TaskFlow</h1>
            </div>
            <Button onClick={() => window.location.href = '/api/login'}>
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Collaboration Made Simple
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A minimalist collaboration tool designed for small teams and freelancers. 
            Manage projects, track time, and stay organized with our clean, intuitive interface.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CheckCircle className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Kanban Boards</CardTitle>
              <CardDescription>
                Organize your tasks with drag-and-drop Kanban boards. Keep track of what's to-do, in progress, and done.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Time Tracking</CardTitle>
              <CardDescription>
                Built-in time tracking for tasks. Generate accurate timesheets and invoices based on your logged hours.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Client Portals</CardTitle>
              <CardDescription>
                Give clients read-only access to project progress. Keep everyone informed without compromising security.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Team Chat</CardTitle>
              <CardDescription>
                Real-time messaging within projects. Share updates, files, and collaborate seamlessly with your team.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <DollarSign className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Invoice Generation</CardTitle>
              <CardDescription>
                Create professional invoices from your time logs. Export to PDF and send directly to clients.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Notes & Files</CardTitle>
              <CardDescription>
                Markdown-powered notes and file attachments. Keep all your project resources in one place.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to streamline your workflow?
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of freelancers and teams who trust TaskFlow for their project management needs.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/login'}
            className="text-lg px-8 py-3"
          >
            Start Free Today
          </Button>
        </div>
      </div>
    </div>
  );
}
