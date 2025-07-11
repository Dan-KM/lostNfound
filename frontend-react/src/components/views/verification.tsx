import React, { useEffect, useState } from 'react';
import { API } from '@/lib/API';
import { Loader2 } from 'lucide-react';
import { ItemVerification } from '@/components/views/verificationAnswers'; 
import { Button } from '@/components/ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

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

interface UserItem {
  id: number;
  user: User;
  serial_id: string;
  status: string;
  reported_date: string;
  item: Item;
  updated_at: string;
}

const MyLostItemsVerificationList: React.FC = () => {
  const [myItems, setMyItems] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyItems = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('inventory/user-item/mine/');
      
      setMyItems(response.data || []);
    } catch (err) {
      setError('Failed to load your items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
        <span className="text-slate-600">Loading your items...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-medium mb-2">{error}</p>
        <Button onClick={fetchMyItems} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (myItems.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        You haven't reported any lost items.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {myItems.map((lostItem) => (
        <Card className='m-4'>
          <CardContent className='flex flex-col gap-2'>
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                {lostItem?.item.name} ({lostItem?.serial_id})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600 mb-1">Reported by:</p>
                  <p className="font-medium">
                    {lostItem?.user.first_name} {lostItem?.user.last_name}
                  </p>
                </div>
                <div>
                  {lostItem?.status && (
                    <>
                      <p className="text-slate-600 mb-1">Status:</p>
                      <Badge variant={lostItem?.status === 'submitted' ? 'default' : 'outline'}>
                        {lostItem?.status}
                      </Badge>
                    </>
                  )}
                </div>
                <div>
                  <p className="text-slate-600 mb-1">Category:</p>
                  <p>{lostItem?.item.category.name} &gt; {lostItem?.item.subcategory.name}</p>
                </div>
                <div>
                  <p className="text-slate-600 mb-1">Location:</p>
                  <p>{lostItem?.item.location}</p>
                </div>
              </div>
            </div>

            <div key={lostItem.id} className="border border-slate-200 p-2 rounded-lg shadow-sm">
              <ItemVerification lostItemId={lostItem.id} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyLostItemsVerificationList;
