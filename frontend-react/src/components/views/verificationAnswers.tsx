import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { API } from '@/lib/API';

interface Question {
  id: number;
  text: string;
  is_required: boolean;
  questionnaire: number;
}

interface QuestionAnswer {
  id: number;
  answer_text: string;
  created_at: string;
  question: Question;
  lost_item: number;
}

interface QuestionAnswerItemProps {
  data: QuestionAnswer;
  index: number;
  userRole?: string;
  onAnswerUpdate?: (answerId: number, newValue: string) => void;
}

const QuestionAnswerItem: React.FC<QuestionAnswerItemProps> = ({ 
  data,
  index,
  userRole = 'claimant',
  onAnswerUpdate = () => {} 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data?.answer_text || '');
  const [saving, setSaving] = useState(false);

  const canEdit = userRole === 'claimant';

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(data.answer_text);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setIsEditing(false);
      onAnswerUpdate(data.id, editValue);
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(data.answer_text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="p-4 bg-slate-50 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="font-medium text-slate-800">
              Question {index + 1}: {data.question.text}
            </p>
            {data.question.is_required && (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            )}
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-slate-600 font-medium">Answer:</span>
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8 text-sm flex-1"
                placeholder="Enter answer..."
                disabled={saving}
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving || !editValue.trim()}
                className="h-8 px-2"
              >
                {saving ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={saving}
                className="h-8 px-2"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            data.answer_text && (
              <div className="flex items-center gap-2 mt-2">
                <p className="text-sm text-slate-600">
                  <strong>Answer:</strong> {data.answer_text}
                </p>
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-6 px-2 text-slate-400 hover:text-slate-600"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )
          )}
          
          {!data.answer_text && !isEditing && canEdit && (
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="h-8 text-sm"
              >
                Add Answer
              </Button>
            </div>
          )}
        </div>
        
        <div className="text-xs text-slate-500 ml-4">
          ID: {data.id}
        </div>
      </div>
    </div>
  );
};

interface QuestionAnswerListProps {
  userRole?: string;
  lost_item_id : number;
  onAnswerUpdate?: (answerId: number, newValue: string) => void;
}

const QuestionAnswerList: React.FC<QuestionAnswerListProps> = ({ 
  userRole = 'claimant',
  onAnswerUpdate = () => {},
  lost_item_id,
}) => {
  const [questions, setQuestions] = useState<QuestionAnswer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resp = await API.get(
        `verify/answer?lost_item=${lost_item_id}`
      )
      setQuestions(resp.data);
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const handleAnswerUpdate = (answerId, newValue) => {
  //   setQuestions(prev => prev.map(item => 
  //     item.id === answerId 
  //       ? { ...item, answer_text: newValue }
  //       : item
  //   ));
  //   onAnswerUpdate(answerId, newValue);
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2 text-slate-600">Loading questions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-600 font-medium">Error</p>
        <p className="text-sm text-red-500 mt-1">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchData}
          className="mt-3"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (

    <div className="space-y-4">
      
      {questions ?  (questions.map((q, index) => (
        <QuestionAnswerItem
          key={q.id}
          data={q}
          index={index}
          userRole={userRole}
          // onAnswerUpdate={handleAnswerUpdate}
        />
      ))):(
        <>
          <div className="text-center p-6">
            <p className="text-red-600 font-medium">No Answers</p>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionAnswerList;