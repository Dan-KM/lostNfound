import { API } from "@/lib/API";
import { Bell, Columns2 } from "lucide-react";
import { useEffect, useState } from "react";

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

  const [allFoundItems, setAllFoundItems] = useState<FoundItemMatch[] | undefined | null>();

  useEffect(()=>{
    async function getMatches (){
      const resp = await  API.get(
        'match/summary/?status=pending'
      )
      setAllFoundItems(resp.data)
    }

    getMatches();
  }, [])

  const navigateMatchDetail = (matchId : string) => {
    window.location.hash = `matches/${matchId}`;
  };

  const filteredItems = allFoundItems

  return (
    <div className="space-y-6 m-4">

      {/* Manager Threshold Control */}
      <div className="bg-white shadow-sm border border-slate-200 p-4 rounded">
        <div className="text-xl font-bold text-slate-800 flex items-center mb-2 shadow-md rounded bg-white p-2" >
          <Columns2 className="mr-3 h-5 w-5 text-blue-600" />
          Found Item Matches
        </div>
        <div
          className="space-y-6 overflow-y-auto max-h-[80svh] scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50"
        >
          {filteredItems && filteredItems.map((item) => (
        <div key={item.found_item.serial_id} className="space-y-4"
            onClick={() => {navigateMatchDetail(item.found_item.serial_id)}}
        >
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            {/* Header row - title and badge on same line */}
            <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-800 flex-1">{item.found_item.item.name}</h3>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Found Item</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
              {item.match_count} Match{item.match_count !== 1 ? 'es' : ''}
            </span>
          </div>
            </div>
            {/* Description */}
            <p className="text-slate-700 mb-3">{item.found_item.item.description.substring(0,50)}...</p>
            {/* Info row - location and date on same line */}
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
        </div>

        {filteredItems && filteredItems.length === 0 && (
          <div className="bg-white shadow-sm border border-slate-200 rounded mt-6">
        <div className="p-12 text-center">
          <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 mb-2">
          </h3>
          <p className="text-slate-600">
            {`No matches found`}
          </p>
        </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchMenu