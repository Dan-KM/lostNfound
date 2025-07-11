import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, Clock, AlertTriangle, Columns2, List } from "lucide-react";
import { API } from "@/lib/API";
import VerificationQuestions from "../uix/verificationQuestions";
import type { FoundItemMatch, Questionnaire } from "@/lib/ADT";
import { QuestionAnswersDisplay } from "./verificationAnswers";


export default function MatchDetails({ matchID }: { matchID: string }) {
  const navigateBackToMenu = () => {
    window.history.back();
  };
  const [expandedItems, setExpandedItems] = useState<FoundItemMatch>();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [details, showDetails] = useState(false);

  useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      const response = await API.get(`match/for/${matchID}/`);
      const data: FoundItemMatch = response.data;
      setExpandedItems(data);

      console.log('match/for', data);
      console.log('expandedItems (corrected)', data); // use data, not expandedItems

      const itemID = data.item?.id;
      if (itemID) {
        console.log('query', `verify/questionnaire/?found_item=${itemID}`);
        const questionnaireResponse = await API.get(
          `verify/questionnaire/?found_item=${itemID}`
        );
        console.log('questionnaireResponse', questionnaireResponse.data);
        const d : Questionnaire = questionnaireResponse.data[0]
        setQuestionnaire(d);
      }
    } catch (err) {
      setError("Failed to load match details");
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
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

  const calculatePercentage = (score: number) => {
    return Math.round(score * 100);
  };

  return (
    <div className="space-y-6 m-4">
      <Button variant="ghost" className="mb-4" onClick={navigateBackToMenu}>
        ← Back to Matches
      </Button>

      <div className="space-y-6">
        {expandedItems ? (
          <div key={expandedItems.serial_id} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

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
                            {details && (
                              <div>
                                <QuestionAnswersDisplay lostItemID = {match.lost_item.item.id}/>
                              </div>
                            )}
                            <CardDescription className="text-sm">
                              {lostItem.item.description}
                            </CardDescription>
                            
                            <div className="pt-2">
                              <Button onClick={()=>{
                                showDetails(!details)
                              }}>
                                {!details? ('View Details'):('hide details')}
                              </Button>
                              <Button>
                                Approve Match
                              </Button>
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
      { questionnaire?.questions && 
        (
          expandedItems &&
          <VerificationQuestions 
            itemName={expandedItems.item.name}
            found_item_id ={expandedItems.item.id}
            questionnaire_id ={questionnaire.id}
          />
        )
      }
    </div>
  );
}