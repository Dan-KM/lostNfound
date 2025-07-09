import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, Plus, Trash2 } from "lucide-react";
import { API } from "@/lib/API";
import { type Questionnaire } from "@/lib/ADT";

type VerificationQuestion = {
    id: number;
    question: string;
};

type verificationQuestionType = {
    found_item_serial_id: string;
    questions: string[];
};

type QuestionnaireResponse = {
    id: number;
    found_item: number;
    created_at: string;
    questions: {
        id: number;
        question_text: string;
        is_required: boolean;
    }[];
}[];

const VerificationQuestions = ({ 
    found_item_serial_id, 
    found_item_id, 
    itemName, 
}: { 
    found_item_serial_id: string; 
    itemName: string; 
    found_item_id: number
}) => {
    const [questions, setQuestions] = useState<VerificationQuestion[]>([]);
    const [newQuestion, setNewQuestion] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasInitialQuestions, setHasInitialQuestions] = useState<boolean>(false);

    // Fetch initial questions when component mounts
    // Fetch initial questions when component mounts
    useEffect(() => {
        const fetchInitialQuestions = async () => {
            try {
                setIsLoading(true);
                const response = await API.get<QuestionnaireResponse>(
                    `verify/questionnaire/?found_item=${found_item_id}`
                );
                
                if (response.data?.length > 0 && response.data[0].questions?.length > 0) {
                    const initialQuestions = response.data[0].questions.map(q => ({
                        id: q.id,
                        question: q.question_text,
                        is_required: q.is_required
                    }));
                    setQuestions(initialQuestions);
                    setHasInitialQuestions(true);
                    console.log("Initial questions loaded:", initialQuestions);
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialQuestions();
    }, [found_item_id]);

    function handleAddQuestion() {
        if (newQuestion.trim()) {
            setQuestions(prev => [
                ...prev,
                {
                    id: prev.length > 0 ? Math.max(...prev.map(q => q.id)) + 1 : 1,
                    question: newQuestion.trim()
                }
            ]);
            setNewQuestion("");
        }
    }

    function handleDeleteQuestion(id: number) {
        setQuestions(prev => prev.filter(q => q.id !== id));
    }

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            handleAddQuestion();
        }
    }

    // async function handleSaveQuestion() {
    //     if (questions.length === 0) return;

    //     setIsLoading(true);
    //     const vquestions: verificationQuestionType = {
    //         found_item_serial_id: found_item_serial_id,
    //         questions: questions.map(q => q.question)
    //     };

    //     try {
    //         let response;
    //         if (hasInitialQuestions) {
    //             // Use PUT for updates
    //             response = await API.put('verify/question/', vquestions);
    //         } else {
    //             // Use POST for new questions
    //             response = await API.post('verify/question/', vquestions);
    //         }
    //         console.log("Success:", response.data);
    //         alert("Questionnaire saved successfully!");
    //         setHasInitialQuestions(true); // Mark as having initial questions after first save
            
    //         // Refresh questions after save
    //         const questionnaireResponse = await API.get(
    //             `verify/questionnaire/?found_item=${found_item_serial_id}`
    //         );
    //         if (questionnaireResponse.data?.questions?.length) {
    //             const updatedQuestions = questionnaireResponse.data.questions.map((q: any) => ({
    //                 id: q.id,
    //                 question: q.question_text,
    //             }));
    //             setQuestions(updatedQuestions);
    //         }
    //     } catch (error: any) {
    //         console.error("Error saving questionnaire:", error);
    //         alert(`Failed to save questionnaire: ${error.message}`);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    // async function handleSaveQuestion() {
    //     if (questions.length === 0) return;

    //     setIsLoading(true);
    //     const payload = {
    //         found_item_serial_id: found_item_serial_id,
    //         questions: questions.map(q => ({
    //             question_text: q.question,
    //         }))
    //     };

    //     try {
    //         let response;
    //         if (hasInitialQuestions) {
    //             // Use PUT for updates
    //             response = await API.put(`verify/question/bulk-update/`, payload);
    //         } else {
    //             // Use POST for new questions
    //             response = await API.post('verify/question/', payload);
    //         }
            
    //         console.log("Save successful:", response.data);
    //         alert("Questions saved successfully!");
    //         setHasInitialQuestions(true);
            
    //         // Refresh questions
    //         const refreshResponse = await API.get<QuestionnaireResponse>(
    //             `verify/questionnaire/?found_item=${found_item_serial_id}`
    //         );
            
    //         if (refreshResponse.data?.length > 0 && refreshResponse.data[0].questions?.length > 0) {
    //             const updatedQuestions = refreshResponse.data[0].questions.map(q => ({
    //                 id: q.id,
    //                 question: q.question_text,
    //                 is_required: q.is_required
    //             }));
    //             setQuestions(updatedQuestions);
    //         }
    //     } catch (error: any) {
    //         console.error("Error saving questions:", error);
    //         alert(`Failed to save questions: ${error.response?.data?.message || error.message}`);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    async function handleSaveQuestion() {
    if (questions.length === 0) return;

    setIsLoading(true);

    const payload = {
        found_item_serial_id: found_item_serial_id,
        questions: questions.map(q => q.question)  // 🔧 FIXED: send strings only
    };

    try {
        let response;
        if (hasInitialQuestions) {
            // Use PUT for updates
            response = await API.put(`verify/question/bulk-update/`, payload);
        } else {
            // Use POST for new questions
            response = await API.post('verify/question/', payload);
        }

        console.log("Save successful:", response.data);
        alert("Questions saved successfully!");
        setHasInitialQuestions(true);

        // Refresh questions
        const refreshResponse = await API.get<QuestionnaireResponse>(
            `verify/questionnaire/?found_item=${found_item_serial_id}`
        );

        if (refreshResponse.data?.length > 0 && refreshResponse.data[0].questions?.length > 0) {
            const updatedQuestions = refreshResponse.data[0].questions.map(q => ({
                id: q.id,
                question: q.question_text,
                is_required: q.is_required
            }));
            setQuestions(updatedQuestions);
        }
    } catch (error: any) {
        console.error("Error saving questions:", error);
        alert(`Failed to save questions: ${error.response?.data?.message || error.message}`);
    } finally {
        setIsLoading(false);
    }
}

    return (
        <Card className="bg-white shadow-sm border border-slate-200">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-slate-800 flex items-center">
                        <HelpCircle className="mr-3 h-5 w-5 text-purple-600" />
                        Verification questions for {itemName}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {isLoading && questions.length === 0 ? (
                        <div className="p-4 bg-slate-50 rounded-lg text-slate-500 text-center">
                            Loading questions...
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="p-4 bg-slate-50 rounded-lg text-slate-500 text-center">
                            No questions added yet
                        </div>
                    ) : (
                        questions.map((q, index) => (
                            <div key={q.id} className="p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-800">
                                            Question {index + 1}: {q.question}
                                        </p>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleDeleteQuestion(q.id)}
                                        disabled={isLoading}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex space-x-2">
                    <Input
                        placeholder="Add a new verification question..."
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleAddQuestion}
                        className="border border-blue-600 text-blue-600 hover:bg-blue-50"
                        variant="secondary"
                        disabled={!newQuestion.trim() || isLoading}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <div>
                    <Button 
                        disabled={questions.length === 0 || isLoading} 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={handleSaveQuestion}
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default VerificationQuestions;