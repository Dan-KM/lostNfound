import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { API } from '@/lib/API';

interface ReportItem {
  category: string;
  subcategories: { [subcategory: string]: number };
}

const ItemReportView: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [report, setReport] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Format API response into array if backend returns an object
  const transformResponse = (data: any): ReportItem[] => {
    if (Array.isArray(data)) return data;
    return Object.entries(data).map(([category, subcategories]) => ({
      category,
      subcategories: subcategories as Record<string, number>,
    }));
  };

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await API.get('inventory/item-report/', {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });

      setReport(transformResponse(res.data));
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Default to last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    setStartDate(format(sevenDaysAgo, 'yyyy-MM-dd'));
    setEndDate(format(today, 'yyyy-MM-dd'));
  }, []);

  useEffect(() => {
    if (startDate && endDate) fetchReport();
  }, [startDate, endDate]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Item Report</h2>

      <div className="flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
        <Button onClick={fetchReport}>Refresh</Button>
      </div>

      {loading && <p>Loading report...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && report.length === 0 && <p>No data for this date range.</p>}

      <div className="space-y-4">
        {report.map(item => (
          <Card key={item.category}>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold">{item.category}</h3>
              <ul className="ml-4 list-disc mt-2">
                {Object.entries(item.subcategories).map(([sub, count]) => (
                  <li key={sub}>
                    <span className="font-medium">{sub}:</span> {count}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ItemReportView;
