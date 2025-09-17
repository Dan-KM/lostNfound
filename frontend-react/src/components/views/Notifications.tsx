import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { API } from "@/lib/API";

interface NotificationData {
  id : number;
  title: string;
  message: string;
  is_read: boolean;
}

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
        const response = await API.get("notifications/");
        setNotifications(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const markAsRead = async (id: number, index: number) => {
  try {
    if (API) {
      await API.post(`notifications/${id}/mark-read/`);
    }
    setNotifications((prev) =>
      prev.map((n, i) => (i === index ? { ...n, is_read: true } : n))
    );
  } catch (err) {
    console.error("Failed to mark notification as read:", err);
  }
};


  useEffect(() => {
    fetchNotifications();
  }, []);  

  const filtered = notifications.filter((n) =>
    filter === "read" ? n.is_read : filter === "unread" ? !n.is_read : true
  );

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Notifications</h2>

      <Tabs value={filter} onValueChange={(val) => setFilter(val as typeof filter)}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>

        <TabsContent value={filter}>
          {loading ? (
            <p className="text-center py-10">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-10">No {filter} notifications</p>
          ) : (
            filtered.map((n, i) => (
              <Card
                key={i}
                className={`mb-4 ${!n.is_read ? "bg-blue-50" : "bg-white"}`}
              >
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold">{n.title}</h3>
                  <p className="text-sm text-gray-700">{n.message}</p>
                  {!n.is_read && (
                    <Button size="sm" onClick={() => markAsRead(n.id, i)}>
                      Mark as Read
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationPage;
