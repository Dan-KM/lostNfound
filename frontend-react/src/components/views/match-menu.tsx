import { API } from "@/lib/API";
import { Bell, Columns2, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "@radix-ui/react-label";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button"; // Assuming you have a button component

type FoundItemMatch = {
  found_item: {
    user: number;
    serial_id: string;
    status: string;
    reported_date: string;
    item: {
      id: number;
      name: string;
      description: string;
      item_image: string | null;
      location: string;
      item_type: string;
      other_details: {
        brand: string;
        color: string;
        material: string;
        hardware: string;
      };
      category: number;
      subcategory: number;
    };
    updated_at: string;
  };
  status: string;
  matched_at: string;
  match_count: number;
};

const MatchMenu = () => {
  const [allFoundItems, setAllFoundItems] = useState<
    FoundItemMatch[] | undefined | null
  >();
  const [matchThreshold, setMatchThreshold] = useState([70]); // default 70%
  const [isMatching, setIsMatching] = useState(false);

  const getMatches = async () => {
    const resp = await API.get("match/?lost_item=&status=pending&found_item=");
    setAllFoundItems(resp.data);
  };

  useEffect(() => {
    getMatches();
  }, []);

  const runMatch = async () => {
    try {
      setIsMatching(true);
      const decimalThreshold = matchThreshold[0] / 100;
      await API.post("match/run-match/", { threshold: decimalThreshold });
      await getMatches(); // refresh after running match
    } catch (err) {
      console.error("Match error:", err);
    } finally {
      setIsMatching(false);
    }
  };

  const navigateMatchDetail = (matchId: string) => {
    window.location.hash = `matches/${matchId}`;
  };

  const filteredItems = allFoundItems;

  return (
    <div className="space-y-6 m-4">
      {/* Manager Threshold Control */}
      <div className="bg-white shadow-sm border border-slate-200 p-4 rounded">
        <div className="text-xl font-bold text-slate-800 flex items-center mb-2 shadow-md rounded bg-white p-2">
          <Columns2 className="mr-3 h-5 w-5 text-blue-600" />
          Found Item Matches
        </div>
        <div className="space-y-6 overflow-y-auto max-h-[80svh] scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
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
                  <Label
                    htmlFor="threshold-slider"
                    className="text-sm font-medium text-slate-700"
                  >
                    Minimum Match Percentage
                  </Label>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
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

                <Button
                  className="mt-2"
                  disabled={isMatching}
                  onClick={runMatch}
                >
                  {isMatching ? "Running Match..." : "Run Match"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {filteredItems &&
            filteredItems.map((item) => (
              <div
                key={item.found_item.serial_id}
                className="space-y-4"
                onClick={() => {
                  navigateMatchDetail(item.found_item.serial_id);
                }}
              >
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-800 flex-1">
                      {item.found_item.item.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        Found Item
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                        {item.match_count} Match
                        {item.match_count !== 1 ? "es" : ""}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-700 mb-3">
                    {item.found_item.item.description.substring(0, 50)}...
                  </p>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">📍</span>
                      <span>{item.found_item.item.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">📅 Matched on : </span>
                      <span>{item.matched_at}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {filteredItems && filteredItems.length === 0 && (
            <div className="bg-white shadow-sm border border-slate-200 rounded mt-6">
              <div className="p-12 text-center">
                <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No matches found</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchMenu;
