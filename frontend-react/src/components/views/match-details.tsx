import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, Columns2, List, User, Mail, Loader2, RefreshCw } from "lucide-react";
import { API } from "@/lib/API";
import VerificationQuestions from "../uix/verificationQuestions";
import type { FoundItemMatch, Questionnaire } from "@/lib/ADT";
import { QuestionAnswersDisplay } from "./verificationAnswers";

interface LoadingStates {
  [key: string]: boolean;
}

interface ErrorStates {
  [key: string]: string | null;
}

export default function MatchDetails({ matchID }: { matchID: string }) {
  const navigateBackToMenu = () => {
    window.history.back();
  };
  
  const [expandedItems, setExpandedItems] = useState<FoundItemMatch>();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [details, showDetails] = useState<{ [key: string]: boolean }>({});
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});
  const [errorStates, setErrorStates] = useState<ErrorStates>({});

  const setButtonLoading = (buttonId: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [buttonId]: loading }));
  };

  const setButtonError = (buttonId: string, error: string | null) => {
    setErrorStates(prev => ({ ...prev, [buttonId]: error }));
  };

  const clearButtonError = (buttonId: string) => {
    setErrorStates(prev => ({ ...prev, [buttonId]: null }));
  };

  async function handleMatchStatusUpdate(matchId: number, newStatus: string, matchIndex: number) {
    const buttonId = `approve-${matchIndex}`;
    
    try {
      setButtonLoading(buttonId, true);
      clearButtonError(buttonId);

      const response = await API.patch(
        `match/${matchId}/update-status/`,
        { status: newStatus }
      );

      console.log("Match status updated:", response.data);
      
      // Refresh data after successful update
      await fetchData();
      
      // Optional: You can add a success toast here
      // toast.success("Status updated successfully!");
      
    } catch (error: any) {
      console.error("Error updating match status:", error);
      
      // Set specific error message based on response
      let errorMessage = "Failed to update match status";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = "Match not found";
      } else if (error.response?.status === 403) {
        errorMessage = "Not authorized to update this match";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }
      
      setButtonError(buttonId, errorMessage);
      
      // Clear error after 5 seconds
      setTimeout(() => clearButtonError(buttonId), 5000);
    } finally {
      setButtonLoading(buttonId, false);
    }
  }

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      
      const response = await API.get(`match/for/${matchID}/`);
      const data: FoundItemMatch = response.data;
      setExpandedItems(data);

      console.log('match/for', data);

      const itemID = data.item?.id;
      if (itemID) {
        try {
          console.log('query', `verify/questionnaire/?found_item=${itemID}`);
          const questionnaireResponse = await API.get(
            `verify/questionnaire/?found_item=${itemID}`
          );
          console.log('questionnaireResponse', questionnaireResponse.data);
          
          if (questionnaireResponse.data && questionnaireResponse.data.length > 0) {
            const d: Questionnaire = questionnaireResponse.data[0];
            setQuestionnaire(d);
          }
        } catch (questionnaireError) {
          console.error('Error fetching questionnaire:', questionnaireError);
          // Don't fail the entire component if questionnaire fails
        }
      }
    } catch (err: any) {
      console.error('Error:', err);
      
      let errorMessage = "Failed to load match details";
      if (err.response?.status === 404) {
        errorMessage = "Match not found";
      } else if (err.response?.status === 403) {
        errorMessage = "Not authorized to view this match";
      } else if (err.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const toggleDetails = (matchIndex: number) => {
    showDetails(prev => ({
      ...prev,
      [matchIndex]: !prev[matchIndex]
    }));
  };

  const retryFetch = () => {
    fetchData();
  };

  useEffect(() => {
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
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "matched":
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const calculatePercentage = (score: number) => {
    return Math.round(score * 100);
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 m-4">
        <Button variant="ghost" className="mb-4" onClick={navigateBackToMenu}>
          ← Back to Matches
        </Button>
        <Card className="bg-white shadow-sm border border-slate-200">
          <CardContent className="p-12 text-center">
            <Loader2 className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              Loading match details...
            </h3>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 m-4">
        <Button variant="ghost" className="mb-4" onClick={navigateBackToMenu}>
          ← Back to Matches
        </Button>
        <Card className="bg-white shadow-sm border border-slate-200">
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              Error Loading Match
            </h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <Button onClick={retryFetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                      const user = lostItem.user;
                      const isDetailsExpanded = details[index] || false;
                      const approveButtonId = `approve-${index}`;
                      const detailsButtonId = `details-${index}`;
                      
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
                            {/* User Information */}
                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                              <div className="flex items-center space-x-2 mb-2">
                                <User className="h-4 w-4 text-slate-600" />
                                <span className="font-medium text-slate-800">Claimant Information</span>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-slate-600">Name:</span>
                                  <span className="text-slate-800">{user.first_name} {user.last_name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-3 w-3 text-slate-600" />
                                  <span className="text-slate-600">{user.email}</span>
                                </div>
                              </div>
                            </div>

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
                            
                            {isDetailsExpanded && (
                              <div>
                                <QuestionAnswersDisplay lostItemID={match.lost_item.item.id} />
                              </div>
                            )}
                            
                            <CardDescription className="text-sm">
                              {lostItem.item.description}
                            </CardDescription>
                            
                            <div className="pt-2 flex flex-col gap-2">
                              <Button 
                                onClick={() => toggleDetails(index)}
                                className="w-full"
                                variant="secondary"
                                disabled={loadingStates[detailsButtonId]}
                              >
                                {loadingStates[detailsButtonId] ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Loading...
                                  </>
                                ) : (
                                  !isDetailsExpanded ? 'View Details' : 'Hide Details'
                                )}
                              </Button>
                              
                              <Button 
                                onClick={() => handleMatchStatusUpdate(expandedItems.found_item_matches[index], "confirmed", index)}
                                className="w-full bg-green-600 hover:bg-green-700"
                                disabled={loadingStates[approveButtonId] || match.status === "confirmed"}
                              >
                                {loadingStates[approveButtonId] ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Approving...
                                  </>
                                ) : match.status === "confirmed" ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Already Approved
                                  </>
                                ) : (
                                  'Approve Match'
                                )}
                              </Button>
                              
                              {errorStates[approveButtonId] && (
                                <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
                                  {errorStates[approveButtonId]}
                                </div>
                              )}
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
        ) : null}
      </div>
      
      {questionnaire?.questions && expandedItems && (
        <VerificationQuestions 
          itemName={expandedItems.item.name}
          found_item_id={expandedItems.item.id}
          questionnaire_id={questionnaire.id}
        />
      )}
    </div>
  );
}