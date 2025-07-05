import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Bell, Eye, CheckCircle, Clock, AlertTriangle, Settings, Columns2, List } from "lucide-react";

export default function MatchDetails({ matchID }: {matchID : string}) {
  const navigateBackToMenu = () => {
    window.history.back()
  };
  const [matchThreshold, setMatchThreshold] = useState([70]);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const allFoundItems = [
    {
      id: 1,
      itemName: "iPhone 13 Pro",
      description: "Black iPhone 13 Pro found in Main Library",
      location: "Main Library, 2nd Floor",
      date: "2024-01-15",
      matches: [
        {
          id: 1,
          claimantName: "John Doe",
          matchPercentage: 95,
          status: "pending_verification",
          submittedDate: "2024-01-10"
        },
        {
          id: 4,
          claimantName: "John Doe",
          matchPercentage: 95,
          status: "pending_verification",
          submittedDate: "2024-01-10"
        },
        {
          id: 5,
          claimantName: "John Doe",
          matchPercentage: 95,
          status: "pending_verification",
          submittedDate: "2024-01-10"
        },
        {
          id: 7,
          claimantName: "John Doe",
          matchPercentage: 95,
          status: "pending_verification",
          submittedDate: "2024-01-10"
        },
        {
          id: 2,
          claimantName: "Sarah Smith",
          matchPercentage: 78,
          status: "answered",
          submittedDate: "2024-01-12"
        }
      ]
    },
    {
      id: 2,
      itemName: "MacBook Pro",
      description: "Silver MacBook Pro 13-inch found in Student Center",
      location: "Student Center, Study Room 3",
      date: "2024-01-14",
      matches: [
        {
          id: 3,
          claimantName: "Mike Johnson",
          matchPercentage: 87,
          status: "confirmed",
          submittedDate: "2024-01-11"
        },
        {
          id: 4,
          claimantName: "Lisa Brown",
          matchPercentage: 72,
          status: "pending_verification",
          submittedDate: "2024-01-13"
        }
      ]
    },
    {
      id: 3,
      itemName: "Blue Wallet",
      description: "Blue leather wallet with credit cards",
      location: "Engineering Building, Room 101",
      date: "2024-01-13",
      matches: [
        {
          id: 5,
          claimantName: "David Wilson",
          matchPercentage: 91,
          status: "confirmed",
          submittedDate: "2024-01-09"
        }
      ]
    },
    {
      id: 4,
      itemName: "Car Keys",
      description: "Toyota car keys with blue keychain",
      location: "Parking Lot A",
      date: "2024-01-12",
      matches: [
        {
          id: 6,
          claimantName: "Emma Davis",
          matchPercentage: 65,
          status: "pending_verification",
          submittedDate: "2024-01-10"
        },
        {
          id: 7,
          claimantName: "Tom Anderson",
          matchPercentage: 58,
          status: "answered",
          submittedDate: "2024-01-11"
        }
      ]
    }
  ];

  // Filter based on threshold and user role
  const getFilteredItems = (matchID : string) => {
    return allFoundItems.filter(item => item.id === parseInt(matchID))
  };

  const filteredItems = getFilteredItems(matchID);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_verification":
        return "bg-yellow-100 text-yellow-800";
      case "answered":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending_verification":
        return <Clock className="h-4 w-4" />;
      case "answered":
        return <AlertTriangle className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getActionButton = (match: any) => {
    switch (match.status) {
      case "pending_verification":
        return (
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Send Questions
          </Button>
        );
      case "answered":
        return (
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Review Answers
          </Button>
        );
      case "confirmed":
        return (
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-4 w-4 mr-2" />
            Schedule Handover
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 m-4" >
      {/* Manager Threshold Control */}
        <Card className="bg-white shadow-sm border border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 flex items-center">
              <Settings className="mr-3 h-5 w-5 text-blue-600" />
              Match Threshold Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="threshold-slider" className="text-sm font-medium text-slate-700">
                  Minimum Match Percentage
                </Label>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {matchThreshold[0]}%
                </Badge>
              </div>
              <Slider
                id="threshold-slider"
                min={50}
                max={100}
                step={5}
                value={matchThreshold}
                onValueChange={setMatchThreshold}
                className="w-full"
              />
              <p className="text-xs text-slate-500">
                Showing {filteredItems.reduce((total, item) => total + item.matches.length, 0)} matches above {matchThreshold[0]}% threshold
              </p>
            </div>
          </CardContent>
        </Card>
      <div className="space-y-6">
        {filteredItems.map((foundItem) => (
  <div key={foundItem.id} className="space-y-4 ">
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* Found Item Card */}
			<Card className="bg-white shadow-sm border border-slate-200">
				<CardHeader>
					<CardTitle className="text-xl text-slate-800 flex items-center">
						<Columns2 className="mr-3 h-5 w-5 text-blue-600" />
						Found Item Details
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<div className="flex items-center space-x-3 mb-3">
							<h3 className="text-lg font-semibold text-slate-800">{foundItem.itemName}</h3>
							<Badge className="bg-blue-100 text-blue-800">Found Item</Badge>
						</div>
						
						<p className="text-slate-700 mb-3">{foundItem.description}</p>
						
						<div className="space-y-2 text-sm">
							<div className="flex items-center text-slate-600">
								<span className="font-medium mr-2">📍 Location:</span>
								<span>{foundItem.location}</span>
							</div>
							<div className="flex items-center text-slate-600">
								<span className="font-medium mr-2">📅 Date Found:</span>
								<span>{foundItem.date}</span>
							</div>
							<div className="flex items-center text-slate-600">
								<span className="font-medium mr-2">🔗 Total Matches:</span>
								<Badge variant="secondary" className="bg-purple-100 text-purple-800">
									{foundItem.matches.length} Potential Match{foundItem.matches.length !== 1 ? 'es' : ''}
								</Badge>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Lost Items Section */}
			<Card className="bg-white shadow-sm border border-slate-200">
				<CardHeader>
					<CardTitle className="text-xl text-slate-800 flex items-center">
						<List className="mr-3 h-5 w-5 text-purple-600" />
						Potential Claimants
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-[400px] overflow-y-auto pr-2 space-y-3">
						{foundItem.matches.map((lostItem) => (
							<Card key={lostItem.id} className="bg-slate-50 border border-slate-200">
								<CardContent className="p-4">
									<div className="space-y-3">
										{/* Claimant Header */}
										<div className="flex items-center justify-between">
											<h5 className="font-semibold text-slate-800">{lostItem.claimantName}</h5>
											<Badge className="bg-purple-100 text-purple-800 font-semibold">
												{lostItem.matchPercentage}% Match
											</Badge>
										</div>
										
										{/* Status and Date */}
										<div className="flex items-center justify-between">
											<Badge className={`${getStatusColor(lostItem.status)} flex items-center space-x-1`}>
												{getStatusIcon(lostItem.status)}
												<span className="capitalize">{lostItem.status.replace('_', ' ')}</span>
											</Badge>
											<span className="text-xs text-slate-500">
												Claim submitted: {lostItem.submittedDate}
											</span>
										</div>
										
										{/* Action Button */}
										<div className="pt-2">
											{getActionButton(lostItem)}
										</div>
									</div>

								</CardContent>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>
			</div>
  </div>
))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="bg-white shadow-sm border border-slate-200">
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              No matches yet
            </h3>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
