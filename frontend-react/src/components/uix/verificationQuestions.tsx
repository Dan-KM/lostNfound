
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Plus, Trash2, CheckCircle } from "lucide-react";

type VerificationQuestion = {
    id : number;
    question : string;
}

const verificationCases = [
    {
      id: 1,
      itemName: "iPhone 13 Pro",
      claimant: "John Smith",
      finder: "Sarah Johnson",
      status: "pending_answers",
      questions: [
        { id: 1, question: "What color is the phone case?", answer: "" },
        { id: 2, question: "What was the last app you used?", answer: "" },
        { id: 3, question: "Are there any cracks on the screen?", answer: "" }
      ]
    },
    {
      id: 2,
      itemName: "MacBook Pro",
      claimant: "Emily Davis",
      finder: "Mike Wilson",
      status: "answered",
      questions: [
        { id: 4, question: "What stickers are on the laptop?", answer: "University logo and a coding sticker" },
        { id: 5, question: "What's the wallpaper?", answer: "Mountain landscape from macOS" },
        { id: 6, question: "Any dents or scratches?", answer: "Small scratch on the top-left corner" }
      ]
    }
  ];

function verificationQuestions() {
    const [questions, setQuestions]=useState<VerificationQuestion[]>()
    const [newQuestion, setNewQuestion]=useState<string>()
    
    function handleAddQuestion (){
        if ( questions &&  newQuestion) {
            setQuestions([...questions, {
                id: questions.length + 1,
                question : newQuestion
            }])
        }
    }
  return (
    <>
        {questions && questions.map((verificationCase) => (
          <Card key={verificationCase.id} className="bg-white shadow-sm border border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-slate-800 flex items-center">
                  <HelpCircle className="mr-3 h-5 w-5 text-purple-600" />
                  {verificationCase.itemName}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    Claimant: 
                  </Badge>
                  <Badge variant="secondary">
                    Finder:
                  </Badge>
                  <Badge 
                    // className={verificationCase.status === "answered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                    className="bg-yellow-100 text-yellow-800"
                  >
                    {/* {verificationCase.status === "answered" ? "Answered" : "Pending Answers"} */} status
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {verificationCase.questions.map((q, index) => (
                  <div key={q.id} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">
                          Question {index + 1}: {q.question}
                        </p>
                        {q.answer && (
                          <p className="text-sm text-slate-600 mt-2">
                            <strong>Answer:</strong> {q.answer}
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {verificationCase.status === "pending_answers" && (
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a new verification question..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => handleAddQuestion()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {verificationCase.status === "answered" && (
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    // onClick={() => handleApproveMatch(verificationCase.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Match
                  </Button>
                  <Button variant="outline">
                    Request More Info
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
    </>
  )
}

export default verificationQuestions