import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Bell, Eye, CheckCircle, Clock, AlertTriangle, Settings, Columns2, List } from "lucide-react";
import { API } from "@/lib/API";

type Category = {
  id: number;
  name: string;
};

type Subcategory = {
  id: number;
  category: number;
  name: string;
};

type Item = {
  id: number;
  name: string;
  description: string;
  category: Category;
  subcategory: Subcategory;
  location: string;
};

type LostItem = {
  user: number;
  serial_id: string;
  status: string;
  reported_date: string;
  item: Item;
  updated_at: string;
};

type PotentialMatch = {
  lost_item: LostItem;
  score: number;
  status: "pending" | "matched" | string;
};

type FoundItemResponse = {
  id: number;
  serial_id: string;
  item: Item;
  status: string;
  reported_date: string;
  updated_at: string;
  potential_matches: PotentialMatch[];
};

export default function MatchDetails({ matchID }: { matchID: string }) {
  const navigateBackToMenu = () => {
    window.history.back();
  };
  const [matchThreshold, setMatchThreshold] = useState([70]);
  const [expandedItems, setExpandedItems] = useState<FoundItemResponse | null>(null);

  useEffect(() => {
    async function fetchMatchDetails() {
      try {
        const response = await API.get(`match/for/${matchID}/`);
        setExpandedItems(response.data);
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    }
    fetchMatchDetails();
  }, [matchID]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "matched":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "matched":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getActionButton = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Review Match
          </Button>
        );
      case "matched":
        return (
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-4 w-4 mr-2" />
            Schedule Return
          </Button>
        );
      default:
        return null;
    }
  };

  const calculatePercentage = (score: number) => {
    return Math.round(score * 100);
  };

  return (
    <div className="space-y-6 m-4">
      <Button variant="ghost" className="mb-4" onClick={navigateBackToMenu}>
        ← Back to Matches
      </Button>

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
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {expandedItems ? (
          <div key={expandedItems.serial_id} className="space-y-4">
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
                      <h3 className="text-lg font-semibold text-slate-800">{expandedItems.item.name}</h3>
                      <Badge className="bg-blue-100 text-blue-800">Found Item</Badge>
                    </div>
                    
                    <CardDescription className="text-slate-700 mb-3">
                      {expandedItems.item.description}
                    </CardDescription>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-slate-600">
                        <span className="font-medium mr-2">📍 Location:</span>
                        <span>{expandedItems.item.location}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <span className="font-medium mr-2">📅 Date Found:</span>
                        <span>{formatDate(expandedItems.reported_date)}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <span className="font-medium mr-2">🏷️ Category:</span>
                        <span>{expandedItems.item.category.name} / {expandedItems.item.subcategory.name}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <span className="font-medium mr-2">🔗 Total Matches:</span>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          {expandedItems.potential_matches.length} Potential Match{expandedItems.potential_matches.length !== 1 ? 'es' : ''}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Potential Matches Card */}
              <Card className="bg-white shadow-sm border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 flex items-center">
                    <List className="mr-3 h-5 w-5 text-purple-600" />
                    Potential Claimants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] overflow-y-auto pr-2 space-y-3">
                    {expandedItems.potential_matches.map((match, index) => {
                      const lostItem = match.lost_item;
                      const matchPercentage = calculatePercentage(match.score);
                      
                      return (
                        <Card key={`${lostItem.serial_id}-${index}`} className="border border-slate-200">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{lostItem.item.name}</CardTitle>
                                <CardDescription className="flex gap-2 items-center mt-1">
                                  <span>Reported: {formatDate(lostItem.reported_date)}</span>
                                  <span>•</span>
                                  <span>{lostItem.item.location}</span>
                                </CardDescription>
                              </div>
                              <Badge>
                                Lost Item
                              </Badge>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-muted-foreground">Match Score</p>
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                  {matchPercentage}%
                                </Badge>
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground">Status</p>
                                <Badge className={`${getStatusColor(match.status)} flex items-center space-x-1`}>
                                  {getStatusIcon(match.status)}
                                  <span className="capitalize">{match.status}</span>
                                </Badge>
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground">Category</p>
                                <p>{lostItem.item.category.name} / {lostItem.item.subcategory.name}</p>
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground">Serial ID</p>
                                <p>{lostItem.serial_id}</p>
                              </div>
                            </div>

                            <CardDescription className="text-sm">
                              {lostItem.item.description}
                            </CardDescription>
                            
                            <div className="pt-2">
                              {getActionButton(match.status)}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="bg-white shadow-sm border border-slate-200">
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                Loading match details...
              </h3>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}