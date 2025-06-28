'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  Package,
  CheckCircle,
  Clock,
  Users
} from "lucide-react";

export const Reports = () => {
  const stats = [
    { title: "Total Items Processed", value: "247", change: "+12%", icon: Package, color: "text-blue-600" },
    { title: "Successful Matches", value: "189", change: "+8%", icon: CheckCircle, color: "text-green-600" },
    { title: "Items in Custody", value: "24", change: "-3%", icon: Clock, color: "text-yellow-600" },
    { title: "Active Users", value: "156", change: "+15%", icon: Users, color: "text-purple-600" },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "handover",
      description: "iPhone 13 Pro handed over to John Smith",
      timestamp: "2024-01-16 14:30",
      serial: "LF-2024-001"
    },
    {
      id: 2,
      type: "reception",
      description: "MacBook Pro received from Sarah Johnson",
      timestamp: "2024-01-16 11:15",
      serial: "LF-2024-005"
    },
    {
      id: 3,
      type: "match",
      description: "New match found for Blue Wallet case",
      timestamp: "2024-01-16 09:45",
      serial: "LF-2024-003"
    },
    {
      id: 4,
      type: "verification",
      description: "Verification completed for Car Keys",
      timestamp: "2024-01-15 16:20",
      serial: "LF-2024-004"
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "handover":
        return "🤝";
      case "reception":
        return "📦";
      case "match":
        return "🔗";
      case "verification":
        return "✅";
      default:
        return "📝";
    }
  };

  const handleDownloadReport = (reportType: string) => {
    // Simulate download
    console.log(`Downloading ${reportType} report...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Reports & Analytics</h2>
        <p className="text-slate-600">
          Generate reports and view system analytics for the Lost & Found system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white shadow-sm border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    <Badge 
                      variant="secondary" 
                      className={stat.change.startsWith('+') ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Generation */}
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl text-slate-800 flex items-center">
            <BarChart3 className="mr-3 h-5 w-5 text-blue-600" />
            Generate Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Audit Report</h3>
                <p className="text-sm text-slate-600 mb-4">Complete audit trail of all system activities</p>
                <div className="space-y-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last7days">Last 7 days</SelectItem>
                      <SelectItem value="last30days">Last 30 days</SelectItem>
                      <SelectItem value="last3months">Last 3 months</SelectItem>
                      <SelectItem value="last6months">Last 6 months</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleDownloadReport("audit")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Audit Report
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Item Reports</h3>
                <p className="text-sm text-slate-600 mb-4">Reports on item reception and withdrawals</p>
                <div className="space-y-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_items">All Items</SelectItem>
                      <SelectItem value="unclaimed">Unclaimed Items</SelectItem>
                      <SelectItem value="handed_over">Handed Over</SelectItem>
                      <SelectItem value="by_category">By Category</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleDownloadReport("items")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Item Report
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Analytics Report</h3>
                <p className="text-sm text-slate-600 mb-4">System usage and performance metrics</p>
                <div className="space-y-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select metrics" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="match_success">Match Success Rate</SelectItem>
                      <SelectItem value="user_activity">User Activity</SelectItem>
                      <SelectItem value="category_trends">Category Trends</SelectItem>
                      <SelectItem value="time_to_match">Time to Match</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleDownloadReport("analytics")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Analytics
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Log */}
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl text-slate-800 flex items-center">
            <Calendar className="mr-3 h-5 w-5 text-green-600" />
            Recent Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                  <div>
                    <p className="font-medium text-slate-900">{activity.description}</p>
                    <p className="text-sm text-slate-500">Serial: {activity.serial}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">{activity.timestamp}</p>
                  <Badge variant="secondary" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
