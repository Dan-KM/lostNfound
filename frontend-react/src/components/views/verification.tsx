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

import { API } from "@/lib/API"
import { useEffect } from "react"
import VerificationQuestions from "../uix/verificationQuestions";

interface VerificationQuestionsProps {
  userRole?: String
}

const Verification = ({ userRole = 'manager' }: VerificationQuestionsProps) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});

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

  
    return (
      <div className="space-y-6 m-4">
        <VerificationQuestions found_item_serial_id='FND-00001' itemName = 'Item Name'/>
      </div>
    );
  
};


export default Verification



// const Verification = () =>{
//   useEffect(()=>{
//     async function getVerification(){
//       const rep = await API.get(
//         'verify/questionnaire/29/'
//       )

//       console.log('response =>', rep);
//     }

//     getVerification()
//   },[])

//   return<>ok</>
// }

// export default Verification