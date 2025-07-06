import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Package, 
  User,
  Eye,
  Trash2,
  Filter,
  Mail
} from "lucide-react";
import { toast } from "sonner";
// import { useToast } from "@/hooks/use-toast";

interface NotificationPageProps {
  userRole: String
}

interface Notification {
  id: number;
  type: "SUBMISSION_CONFIRMATION" | "MATCH_FOUND" | "VERIFICATION_REQUIRED" | "POTENTIAL_OWNER_FOUND" | "ITEM_RETURNED";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  itemName?: string;
  location?: string;
  priority: "low" | "medium" | "high";
  actionRequired?: boolean;
}

function Notifications() {
  // const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  // Mock notifications data based on user role
  const getAllNotifications = (): Notification[] => {
    const baseNotifications: Notification[] = [
      {
        id: 1,
        type: "SUBMISSION_CONFIRMATION",
        title: "Report submitted successfully",
        message: "Your lost iPhone 13 Pro report has been submitted and is being processed by our system.",
        timestamp: "2024-01-15T10:30:00Z",
        isRead: false,
        itemName: "iPhone 13 Pro",
        priority: "low",
        actionRequired: false
      },
      {
        id: 2,
        type: "MATCH_FOUND",
        title: "Potential match found for your item",
        message: "We found a potential match for your lost MacBook Pro. Please review the details and provide verification.",
        timestamp: "2024-01-14T14:20:00Z",
        isRead: false,
        itemName: "MacBook Pro",
        location: "Main Library",
        priority: "high",
        actionRequired: true
      },
      {
        id: 3,
        type: "VERIFICATION_REQUIRED",
        title: "Additional information needed",
        message: "To verify your ownership claim for the Blue Wallet, please answer the verification questions.",
        timestamp: "2024-01-13T09:15:00Z",
        isRead: true,
        itemName: "Blue Wallet",
        priority: "medium",
        actionRequired: true
      },
      {
        id: 4,
        type: "ITEM_RETURNED",
        title: "Congratulations! Your item has been returned",
        message: "Your car keys have been successfully returned. Thank you for using our Lost & Found system.",
        timestamp: "2024-01-12T16:45:00Z",
        isRead: true,
        itemName: "Car Keys",
        priority: "low",
        actionRequired: false
      }
    ];
    return baseNotifications;
  };

  const [notifications, setNotifications] = useState<Notification[]>(getAllNotifications());

  const getFilteredNotifications = () => {
    switch (filter) {
      case "unread":
        return notifications.filter(n => !n.isRead);
      case "read":
        return notifications.filter(n => n.isRead);
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "SUBMISSION_CONFIRMATION":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "MATCH_FOUND":
        return <Package className="h-5 w-5 text-blue-600" />;
      case "VERIFICATION_REQUIRED":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "POTENTIAL_OWNER_FOUND":
        return <User className="h-5 w-5 text-purple-600" />;
      case "ITEM_RETURNED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast("Notification deleted",{

      description: "The notification has been removed.",
    });
  };

  const handleAction = (notification: Notification) => {
    switch (notification.type) {
      case "MATCH_FOUND":
        toast("Viewing match details",{

          description: `Opening details for ${notification.itemName}`,
        });
        break;
      case "VERIFICATION_REQUIRED":
        toast("Opening verification",{

          description: "Redirecting to verification questions...",
        });
        break;
      case "POTENTIAL_OWNER_FOUND":
        toast("Opening review",{
          description: "Redirecting to match review page...",
        });
        break;
    }
    markAsRead(notification.id);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Notifications</h2>
          <p className="text-slate-600">
            Stay updated with your Lost & Found activities
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {unreadCount} unread
          </Badge>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>All ({notifications.length})</span>
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Unread ({unreadCount})</span>
          </TabsTrigger>
          <TabsTrigger value="read" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Read ({notifications.length - unreadCount})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4 mt-6">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : 'bg-white'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className={`font-semibold ${!notification.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center space-x-3 text-xs text-slate-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimestamp(notification.timestamp)}</span>
                          </span>
                          
                          {notification.itemName && (
                            <span className="flex items-center space-x-1">
                              <Package className="h-3 w-3" />
                              <span>{notification.itemName}</span>
                            </span>
                          )}
                          
                          {notification.location && (
                            <span>• {notification.location}</span>
                          )}
                          
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          
                          {notification.actionRequired && (
                            <Badge className="bg-orange-100 text-orange-800">
                              Action Required
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {notification.actionRequired && (
                        <Button 
                          size="sm" 
                          onClick={() => handleAction(notification)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Take Action
                        </Button>
                      )}
                      
                      {!notification.isRead && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-white">
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-800 mb-2">
                  No {filter !== "all" ? filter : ""} notifications
                </h3>
                <p className="text-slate-600">
                  {filter === "unread" 
                    ? "All caught up! No unread notifications."
                    : filter === "read"
                    ? "No read notifications found."
                    : "You don't have any notifications yet."
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications