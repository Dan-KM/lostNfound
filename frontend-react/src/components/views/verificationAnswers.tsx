import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Check, X, Loader2, HelpCircle } from 'lucide-react';
import { API } from '@/lib/API';
import { useAuth } from '@/hooks/useAuthProvider';

interface User {
  first_name: string;
  last_name: string;
  email: string;
}

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  category: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  description: string;
  category: Category;
  subcategory: Subcategory;
  location: string;
}

interface LostItem {
  id: number;
  user: User;
  serial_id: string;
  status: string;
  reported_date: string;
  item: Item;
  updated_at: string;
}

interface Question {
  id: number;
  question_text: string;
  is_required: boolean;
}

interface VerificationAnswer {
  id: number;
  status: string;
  answer_text: string;
  created_at: string;
  question: Question;
  lost_item: LostItem;
}

const AnswerItem: React.FC<{
  answer: VerificationAnswer;
  index: number;
  onUpdate: (updatedAnswer: VerificationAnswer) => Promise<void>;
  canEdit: boolean;
}> = ({ answer, index, onUpdate, canEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(answer.answer_text);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (answer.question.is_required && !editValue.trim()) {
      setError('This answer is required');
      return;
    }

    try {
      setIsSaving(true);
      const updatedAnswer = {
        ...answer,
        answer_text: editValue,
        status: 'submitted'
      };
      await onUpdate(updatedAnswer);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save answer');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(answer.answer_text);
    setIsEditing(false);
    setError('');
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
                Q{index + 1}: {answer.question.question_text}
              </h4>
              {answer.question.is_required && (
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
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
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
                  onClick={handleCancel}
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
                <p className="text-slate-800">{answer.answer_text}</p>
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
  const [answers, setAnswers] = useState<VerificationAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth(); // ✅ Get current user
  const isClaimant = currentUser?.user_role === 'claimant'; // ✅ Role check

  const fetchAnswers = async () => {
    try {
      setIsLoading(true);
      const response = await API.get(`verify/answer/?lost_item=${lostItemId}`);
      setAnswers(response.data || []);
    } catch (err) {
      setError('Failed to load verification questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAnswer = async (updatedAnswer: VerificationAnswer) => {
    try {
      await API.patch(`verify/answer/${updatedAnswer.id}/`, {
        answer_text: updatedAnswer.answer_text,
        status: updatedAnswer.status
      });
      setAnswers(prev =>
        prev.map(a => a.id === updatedAnswer.id ? updatedAnswer : a)
      );
    } catch (err) {
      throw new Error('Failed to update answer');
    }
  };

  useEffect(() => {
    fetchAnswers();
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
        <Button
          variant="outline"
          onClick={fetchAnswers}
        >
          Try Again
        </Button>
      </div>
    );
  }



  if (answers.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        No verification questions found for this item.
      </div>
    );
  }

  const lostItem = answers[0]?.lost_item;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Verification Questions
        </h3>
        {answers.map((answer, index) => (
          <AnswerItem
            key={answer.id}
            answer={answer}
            index={index}
            onUpdate={handleUpdateAnswer}
            canEdit={isClaimant}
          />
        ))}
      </div>
    </div>
  );
};
