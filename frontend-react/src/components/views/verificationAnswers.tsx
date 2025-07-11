import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Check, X, Loader2, HelpCircle } from 'lucide-react';
import { API } from '@/lib/API';
import { useAuth } from '@/hooks/useAuthProvider';

// Interfaces (same as before)
interface Item {
  id: number;
  name: string;
  description: string;
  item_image: string | null;
  location: string;
  item_type: string;
  other_details: any;
  category: number;
  subcategory: number;
}

interface Question {
  id: number;
  questionnaire: number;
  question_text: string;
  is_required: boolean;
}

interface Answer {
  id: number;
  status: string;
  answer_text: string;
  created_at: string;
  question: number;
  lost_item: number;
}

interface LostItem {
  id: number;
  serial_id: string;
  item: Item;
  questions: Question[];
  answers: Answer[];
}

const AnswerItem: React.FC<{
  answer: Answer;
  question: Question;
  index: number;
  onUpdate: (updatedAnswer: Answer) => Promise<void>;
  canEdit: boolean;
}> = ({ answer, question, index, onUpdate, canEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(answer.answer_text);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (question.is_required && !editValue.trim()) {
    setError("This answer is required");
    return;
  }

  try {
    setIsSaving(true);

    // Use PUT for both creation and updates
    const response = await API.put(
      `verify/answer/put-answer/`,
      {
        id: answer.id !== 0 ? answer.id : undefined, // Include only if editing existing
        question: question.id,
        lost_item: answer.lost_item,
        answer_text: editValue,
        status: "pending",
      }
    );


    // Update local state
    onUpdate(response.data);
    setIsEditing(false);
  } catch (err) {
    setError("Failed to save answer");
  } finally {
    setIsSaving(false);
  }
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-blue-500">
          <HelpCircle className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-slate-800">
                Q{index + 1}: {question.question_text}
              </h4>
              {question.is_required && (
                <Badge variant="destructive" className="text-xs px-2 py-0.5">
                  Required
                </Badge>
              )}
            </div>
            <span className="text-xs text-slate-500">
              {new Date(answer.created_at).toLocaleDateString()}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-9"
                disabled={isSaving}
                autoFocus
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Check className="h-4 w-4 mr-1" />
                  )}
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Your answer:</p>
                <p className="text-slate-800">{answer.answer_text || '—'}</p>
              </div>
              {canEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ItemVerification: React.FC<{ lostItemId: number }> = ({ lostItemId }) => {
  const [lostItem, setLostItem] = useState<LostItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const isClaimant = currentUser?.user_role === 'claimant';

  const fetchLostItem = async () => {
    try {
      setIsLoading(true);
      const response = await API.get(`verify/claimant/`);
      console.log('API returned:', response.data);

      const items: LostItem[] = response.data;
      const match = items.find(i => i.id === lostItemId);

      if (!match) {
        setError('Lost item not found.');
        setLostItem(null);
      } else {
        setLostItem(match);
      }
    } catch (err) {
      console.error('Failed to fetch:', err);
      setError('Failed to load lost item details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAnswer = async (updatedAnswer: Answer) => {
    // try {
    //   await API.patch(`/answers/${updatedAnswer.id}/`, {
    //     answer_text: updatedAnswer.answer_text,
    //     status: updatedAnswer.status
    //   });

    //   setLostItem(prev => {
    //     if (!prev) return null;
    //     return {
    //       ...prev,
    //       answers: prev.answers.map(a =>
    //         a.id === updatedAnswer.id ? updatedAnswer : a
    //       )
    //     };
    //   });
    // } catch (err) {
    //   console.error(err);
    //   throw new Error('Failed to update answer');
    // }
      setLostItem(prev => {
      if (!prev) return null;
      
      // Replace existing answer or add new one
      const updatedAnswers = prev.answers?.some(a => a.id === updatedAnswer.id)
        ? prev.answers.map(a => a.id === updatedAnswer.id ? updatedAnswer : a)
        : [...(prev.answers || []), updatedAnswer];

      return {
        ...prev,
        answers: updatedAnswers,
      };
    });
  };

  useEffect(() => {
    fetchLostItem();
  }, [lostItemId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
        <span className="text-slate-600">Loading verification questions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-medium mb-2">{error}</p>
        <Button variant="outline" onClick={fetchLostItem}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!lostItem) {
    return (
      <div className="p-6 text-center text-slate-500">
        Item not found.
      </div>
    );
  }

  const questionAnswerPairs = (lostItem.questions || []).map(question => {
    const answer = (lostItem.answers || []).find(a => a.question === question.id) || {
      id: 0,
      status: 'pending',
      answer_text: '',
      created_at: new Date().toISOString(),
      question: question.id,
      lost_item: lostItem.id
    };
    return { question, answer };
  });

  if (questionAnswerPairs.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        No verification questions found for this item.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Verification Questions
        </h3>
        {questionAnswerPairs.map(({ question, answer }, index) => (
          <AnswerItem
            key={question.id}
            answer={answer}
            question={question}
            index={index}
            onUpdate={handleUpdateAnswer}
            canEdit={isClaimant}
          />
        ))}
      </div>
    </div>
  );
};
