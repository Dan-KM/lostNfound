
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Plus, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
// import { useToast } from "@/hooks/use-toast";

interface VerificationQuestionsProps {
  userRole: String
}

export const VerificationQuestions = ({ userRole }: VerificationQuestionsProps) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  // const { toast } = useToast();

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

  const handleAddQuestion = (caseId: number) => {
    if (newQuestion.trim()) {
      toast("Question Added",{
        description: "New verification question has been added to the case.",
      });
      setNewQuestion("");
    }
  };

  const handleSubmitAnswers = (caseId: number) => {
    toast("Answers Submitted",{
      description: "Your answers have been submitted for verification.",
    });
  };

  const handleApproveMatch = (caseId: number) => {
    toast("Match Approved",{

      description: "The match has been approved. Handover can now proceed.",
    });
  };

  if (userRole === "claimant") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Verification Questions</h2>
          <p className="text-slate-600">
            Answer these questions to verify ownership of your items.
          </p>
        </div>

        {verificationCases.filter(c => c.status === "pending_answers").map((verificationCase) => (
          <Card key={verificationCase.id} className="bg-white shadow-sm border border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-slate-800 flex items-center">
                  <HelpCircle className="mr-3 h-5 w-5 text-blue-600" />
                  {verificationCase.itemName}
                </CardTitle>
                <Badge variant="secondary">
                  Found by: {verificationCase.finder}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {verificationCase.questions.map((q, index) => (
                <div key={q.id} className="space-y-2">
                  <Label htmlFor={`question-${q.id}`}>
                    Question {index + 1}: {q.question}
                  </Label>
                  <Input
                    id={`question-${q.id}`}
                    placeholder="Your answer..."
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  />
                </div>
              ))}
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => handleSubmitAnswers(verificationCase.id)}
              >
                Submit Answers
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (userRole === "manager") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Verification Management</h2>
          <p className="text-slate-600">
            Create verification questions and review answers from claimants.
          </p>
        </div>

        {verificationCases.map((verificationCase) => (
          <Card key={verificationCase.id} className="bg-white shadow-sm border border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-slate-800 flex items-center">
                  <HelpCircle className="mr-3 h-5 w-5 text-purple-600" />
                  {verificationCase.itemName}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    Claimant: {verificationCase.claimant}
                  </Badge>
                  <Badge variant="secondary">
                    Finder: {verificationCase.finder}
                  </Badge>
                  <Badge 
                    className={verificationCase.status === "answered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                  >
                    {verificationCase.status === "answered" ? "Answered" : "Pending Answers"}
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
                    onClick={() => handleAddQuestion(verificationCase.id)}
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
                    onClick={() => handleApproveMatch(verificationCase.id)}
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
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <HelpCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-slate-800 mb-2">No verification access</h3>
      <p className="text-slate-600">
        Verification questions are only available for claimants and managers.
      </p>
    </div>
  );
};
