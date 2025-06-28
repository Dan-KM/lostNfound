
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Search, 
  Plus, 
  Bell, 
  HelpCircle, 
  Settings, 
  Package,
  FileText,
  Shield,
  BarChart3
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  userRole: "claimant" | "finder" | "manager";
}

export const Sidebar = ({ activeSection, setActiveSection, userRole }: SidebarProps) => {
  const getMenuItems = () => {
    const baseItems = [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "matches", label: "Matches", icon: Bell },
    ];

    if (userRole === "claimant") {
      baseItems.push({ id: "submit-lost", label: "Report Lost Item", icon: Search });
    }

    if (userRole === "finder") {
      baseItems.push({ id: "submit-found", label: "Report Found Item", icon: Plus });
    }

    if (userRole === "manager") {
      baseItems.push(
        { id: "verification", label: "Verification", icon: HelpCircle },
        { id: "manager-tools", label: "Manager Tools", icon: Shield },
        { id: "reports", label: "Reports", icon: BarChart3 }
      );
    }

    if (userRole === "claimant" || userRole === "manager") {
      baseItems.push({ id: "verification", label: "Verification", icon: HelpCircle });
    }

    return baseItems;
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 p-4">
      <nav className="space-y-2">
        {getMenuItems().map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start text-left",
              activeSection === item.id 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
            onClick={() => setActiveSection(item.id)}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </div>
  );
};
