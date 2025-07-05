import { Bell, Columns2 } from "lucide-react";


const MatchMenu = () => {

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


  const navigateMatchDetail = (matchId : number) => {
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
          className="space-y-6 overflow-y-auto max-h-[calc(72svh)] scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50"
        >
          {filteredItems.map((item) => (
        <div key={item.id} className="space-y-4"
            onClick={() => {navigateMatchDetail(item.id)}}
        >
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            {/* Header row - title and badge on same line */}
            <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-800 flex-1">{item.itemName}</h3>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Found Item</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
              {item.matches.length} Match{item.matches.length !== 1 ? 'es' : ''}
            </span>
          </div>
            </div>
            {/* Description */}
            <p className="text-slate-700 mb-3">{item.description}</p>
            {/* Info row - location and date on same line */}
            <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center">
            <span className="font-medium mr-2">📍</span>
            <span>{item.location}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium mr-2">📅</span>
            <span>{item.date}</span>
          </div>
            </div>
          </div>
        </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
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