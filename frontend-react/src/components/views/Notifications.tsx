import { API } from '@/lib/API';
import React, { useEffect, useState } from 'react';

interface NotificationData {
  title: string;
  message: string;
}

interface NotificationProps {
  notification: NotificationData;
}

const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  
  const toggleExpand = (): void => {
    setExpanded(!expanded);
  };

  return (
    <div 
      className={`border border-gray-200 rounded-md p-3 my-2 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${
        expanded ? 'shadow-sm' : ''
      }`}
      onClick={toggleExpand}
    >
      <h3 className="font-medium text-lg mb-1">{notification.title}</h3>
      <p className="text-gray-700">
        {expanded 
          ? notification.message 
          : `${notification.message.substring(0, 50)}${notification.message.length > 50 ? '...' : ''}`
        }
      </p>
      {notification.message.length > 50 && (
        <div className="text-sm text-gray-500 mt-1">
          {expanded ? 'Click to collapse' : 'Click to expand'}
        </div>
      )}
    </div>
  );
};


const NotificationsList = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>()
  async function fetchData(){
    try {
      const r = await API.get('notifications/')
      const t : NotificationData[] = r.data
      setNotifications(t)
    } catch (first) {
      console.error(first)
    }
  }

  useEffect(()=>{fetchData()}, [])

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications && notifications.map((notification, index) => (
        <Notification key={index} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationsList;
export { Notification };
export type { NotificationData, NotificationProps };