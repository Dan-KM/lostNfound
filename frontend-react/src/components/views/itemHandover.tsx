import { API } from "@/lib/API";
import { useEffect } from "react";

import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Button } from "../ui/button";

type Match = {
  id: number;
  lost_item: {
    id : number,
    serial_id: string;
    user: {
      first_name: string;
      last_name: string;
    };
    item: {
      name: string;
      description: string;
      location: string;
    };
    status: string;
  };
  found_item: {
    id : number,
    serial_id: string;
    item: {
      name: string;
      description: string;
    };
    status: string;
  };
  score: number;
  status: string;
};

export const MatchList = ({ matches, refreshData }: { matches: Match[], refreshData: ()=> Promise<void> }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMatches = matches.filter((match) => {
  if (!searchTerm) return true; // Return all matches if no search term
  
  const searchLower = searchTerm.toLowerCase();
  
  // Safely access nested properties with optional chaining
  const lostSerialId = match.lost_item?.serial_id?.toLowerCase() || '';
  const lostItemName = match.lost_item?.item?.name?.toLowerCase() || '';
  const lostDescription = match.lost_item?.item?.description?.toLowerCase() || '';
  const foundSerialId = match.found_item?.serial_id?.toLowerCase() || '';
  const foundItemName = match.found_item?.item?.name?.toLowerCase() || '';
  const ownerName = `${match.lost_item?.user?.first_name || ''} ${match.lost_item?.user?.last_name || ''}`.toLowerCase();

  return (
    lostSerialId.includes(searchLower) ||
    lostItemName.includes(searchLower) ||
    lostDescription.includes(searchLower) ||
    foundSerialId.includes(searchLower) ||
    foundItemName.includes(searchLower) ||
    ownerName.includes(searchLower)
  );
});

async function handleItemHandover(found_id: number, lost_id: number, matchId: number) {
    try {
        await API.patch(`match/${matchId}/resolve-match/`, {
            found_id,
            lost_id,
        });

        refreshData();
    } catch (error) {
        console.error("Error resolving match:", error);
    }
}



const getStatusVariant = (status: string | undefined): "default" | "secondary" | "destructive" | "success" | "outline" => {
  if (!status) return "outline";
  
  switch (status.toLowerCase()) {
    case "pending":
      return "secondary";
    case "submitted":
      return "default";
    case "confirmed":
      return "success";
    case "rejected":
      return "destructive";
    default:
      return "outline";
  }
};

  const truncateText = (desc: string, maxLength = 30) => {
    return desc.length > maxLength ? `${desc.substring(0, maxLength)}...` : desc
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Lost & Found Matches</h2>
        <Input
          placeholder="Search matches..."
          className="max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Lost Item</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="w-[150px]">Found Item</TableHead>
              <TableHead className="text-right">Match Score</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMatches.map((match) => (
              <TableRow key={match.id}>
                {/* Lost Item Column */}
                <TableCell>
                  <div className="font-medium">{match.lost_item.item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {match.lost_item.serial_id}
                  </div>
                  <div className="text-sm">
                    {truncateText(match.lost_item.item.description)}
                  </div>
                </TableCell>

                {/* Owner Column */}
                <TableCell>
                  {match.lost_item.user.first_name} {match.lost_item.user.last_name}
                </TableCell>

                {/* Location Column */}
                <TableCell>
                  {truncateText(match.lost_item.item.location, 20)}
                </TableCell>

                {/* Found Item Column */}
                <TableCell>
                  <div className="font-medium">{match.found_item.item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {match.found_item.serial_id}
                  </div>
                  <div className="text-sm">
                    {truncateText(match.found_item.item.description)}
                  </div>
                </TableCell>

                {/* Match Score Column */}
                <TableCell>
                  <div className="text-right font-bold">
                      {(match.score * 100).toFixed(0)}%
                  </div>
                </TableCell>

                {/* Status Column */}
                <TableCell className="text-center">
                  <Badge variant={getStatusVariant(match.status)}>
                    {match.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => {handleItemHandover(match.found_item.id, match.lost_item.id, match.id)}}
                  >
                    Handover
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

const ItemHandover = () => {

  const [APIRep , setAPIRep] = useState<Match[]>([])

  async function fetchData (){
    try {
      const response = await API.get('match/?&status=confirmed')
      const t : Match[] = response.data
      setAPIRep(t)

    } catch (first) {
      console.error(first)
    }
  }

  useEffect(()=>{
    fetchData()
  }, [])

  if(APIRep){
    return(<MatchList matches={APIRep} refreshData = {fetchData}/>)
  }

  return(
    <div className="p-4 bg-slate-50 rounded-lg text-slate-500 text-center">
      No Approved Match
    </div>
  )


}

export default ItemHandover