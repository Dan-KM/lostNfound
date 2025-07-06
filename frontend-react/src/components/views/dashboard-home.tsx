
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp
} from "lucide-react";
import ProtectedRoutes from "@/hooks/protectedRoutes";
import { useAuth } from "@/hooks/useAuthProvider";
import { useEffect, useState } from "react";


export const Dashboard = () => {
  const {currentUser} = useAuth()
  
  const [currentUserRole, setCurrentUserRole] = useState<string | null>()

  useEffect(() => {
    if(currentUser)
      setCurrentUserRole(currentUser.user_role)
  }, [currentUser])

  const getStats = () => {
    switch (currentUserRole) {
      case "claimant":
        return [
          { title: "Lost Items Reported", value: "3", icon: Search, color: "text-orange-600" },
          { title: "Potential Matches", value: "2", icon: AlertCircle, color: "text-blue-600" },
          { title: "Items Recovered", value: "1", icon: CheckCircle, color: "text-green-600" },
          { title: "Pending Verification", value: "1", icon: Clock, color: "text-yellow-600" },
        ];
      case "finder":
        return [
          { title: "Found Items Reported", value: "5", icon: Package, color: "text-blue-600" },
          // { title: "Items Matched", value: "3", icon: CheckCircle, color: "text-green-600" },
          // { title: "Pending Claims", value: "2", icon: Clock, color: "text-yellow-600" },
          // { title: "Items Handed Over", value: "3", icon: TrendingUp, color: "text-purple-600" },
        ];
      case "manager":
        return [
          { title: "Active Cases", value: "24", icon: Package, color: "text-blue-600" },
          { title: "Pending Verifications", value: "8", icon: AlertCircle, color: "text-orange-600" },
          { title: "Successful Matches", value: "47", icon: CheckCircle, color: "text-green-600" },
          { title: "Items in Custody", value: "12", icon: Clock, color: "text-yellow-600" },
        ];
        default:
          return [
            { title: "Not Logged in", value: "3", icon: Search, color: "text-orange-600" },
          ];
    }
  };

  const getRecentActivity = () => {
    switch (currentUserRole) {
      case "claimant":
        return [
          { id: 1, text: "New potential match for your iPhone 13", time: "2 hours ago", type: "match" },
          { id: 2, text: "Verification questions sent for MacBook Pro", time: "1 day ago", type: "verification" },
          { id: 3, text: "Lost item report submitted: Wallet", time: "3 days ago", type: "submission" },
        ];
      case "finder":
        return [
          { id: 1, text: "Found item matched: iPhone 13", time: "1 hour ago", type: "match" },
          { id: 2, text: "Item handed over: MacBook Pro", time: "2 days ago", type: "handover" },
          { id: 3, text: "Found item report submitted: Car Keys", time: "4 days ago", type: "submission" },
        ];
      case "manager":
        return [
          { id: 1, text: "Verification completed for iPhone case", time: "30 minutes ago", type: "verification" },
          { id: 2, text: "New found item received: Laptop Bag", time: "2 hours ago", type: "reception" },
          { id: 3, text: "Item handover scheduled: Wallet", time: "4 hours ago", type: "handover" },
        ];
        default:
          return [
            { id: 1, text: "Not logged in", time: "2 hours ago", type: "match" },
          ];
    }
  };

  return (
    <ProtectedRoutes allowedRoles={['admin','manager', 'claimant', 'finder']}>
      <div className="space-y-6 m-4">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome back!</h2>
        <p className="text-slate-600">
          {currentUserRole === "claimant" && "Track your lost items and view potential matches."}
          {currentUserRole === "finder" && "Manage your found item reports and help reunite items."}
          {currentUserRole === "manager" && "Oversee the lost and found system operations."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStats().map((stat, index) => (
          <Card key={index} className="bg-white shadow-sm border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getRecentActivity().map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{activity.text}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </ProtectedRoutes>
    
  );
};
