import { createRef, useEffect, useState } from "react";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuthProvider";
import { API } from "@/lib/API";

export const Dashboard = () => {
  const { currentUser } = useAuth();

  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [userItems, setUserItems] = useState<any[]>([]);


  async function fetchItems (){
    try {
      const res = await API.get("inventory/user-item/mine/")
      setUserItems(res.data)
    } catch (first) {
      console.error(first)    
    }
  }

  useEffect(() => {
    if (currentUser) {
      setCurrentUserRole(currentUser.user_role);
      fetchItems ()
    }
  }, [currentUser]);

  const getStats = () => {
    switch (currentUserRole) {
      case "finder":
        return [
          {
            title: "Found Items Reported",
            value: userItems.length.toString(),
            icon: Package,
            color: "text-blue-600",
          },
        ];
      case "claimant":
        return [
          {
            title: "Lost Items Reported",
            value: userItems.length.toString(),
            icon: Search,
            color: "text-orange-600",
          },
          {
            title: "Potential Matches",
            value: "2", // Replace with dynamic value if available
            icon: AlertCircle,
            color: "text-blue-600",
          },
          {
            title: "Items Recovered",
            value: "1", // Replace with dynamic value if available
            icon: CheckCircle,
            color: "text-green-600",
          },
          {
            title: "Pending Verification",
            value: "1", // Replace with dynamic value if available
            icon: Clock,
            color: "text-yellow-600",
          },
        ];
      case "manager":
        return [
          {
            title: "Active Cases",
            value: "24",
            icon: Package,
            color: "text-blue-600",
          },
          {
            title: "Pending Verifications",
            value: "8",
            icon: AlertCircle,
            color: "text-orange-600",
          },
          {
            title: "Successful Matches",
            value: "47",
            icon: CheckCircle,
            color: "text-green-600",
          },
          {
            title: "Items in Custody",
            value: "12",
            icon: Clock,
            color: "text-yellow-600",
          },
        ];
      default:
        return [
          {
            title: "Not Logged In",
            value: "0",
            icon: Search,
            color: "text-orange-600",
          },
        ];
    }
  };

  return (
    <div className="space-y-6 m-4">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome back!</h2>
        <p className="text-slate-600">
          {currentUserRole === "claimant" &&
            "Track your lost items and view potential matches."}
          {currentUserRole === "finder" &&
            "Manage your found item reports and help reunite items."}
          {currentUserRole === "manager" &&
            "Oversee the lost and found system operations."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStats().map((stat, index) => (
          <Card key={index} className="bg-white shadow-sm border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Items Table */}
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">
            {currentUserRole === "finder" ? "Found Items" : "Lost Items"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userItems.length === 0 ? (
            <p className="text-slate-500 text-sm">No items found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-sm text-left">
                <thead className="text-xs uppercase text-slate-500 border-b">
                  <tr>
                    <th className="px-4 py-2">Serial ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Subcategory</th>
                    <th className="px-4 py-2">Location</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Reported</th>
                  </tr>
                </thead>
                <tbody>
                  {userItems.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-2 font-mono">{item.serial_id}</td>
                      <td className="px-4 py-2">{item.item.name}</td>
                      <td className="px-4 py-2">{item.item.description}</td>
                      <td className="px-4 py-2">{item.item.category.name}</td>
                      <td className="px-4 py-2">{item.item.subcategory.name}</td>
                      <td className="px-4 py-2">{item.item.location}</td>
                      <td className="px-4 py-2">{item.status || "Pending"}</td>
                      <td className="px-4 py-2">
                        {new Date(item.reported_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
