
'use client';

import { useMemo, useState, useEffect } from 'react';
import { Drawer } from '@mantine/core';

type NotificationItem = {
  id: number | string;
  description: string;
  createdAt?: string | Date;
  isRead?: boolean;
};

interface NotiDrawerProps {
  initialItems?: NotificationItem[];
  iconClassName?: string;
  badgeOffset?: { top?: number; right?: number };
  onItemClick?: (item: NotificationItem) => void;
  onMarkAll?: (items: NotificationItem[]) => void;
}

export default function NotiDrawer({
  initialItems = [],
  iconClassName,
  badgeOffset,
  onItemClick,
  onMarkAll,
}: NotiDrawerProps) {
  const [items, setItems] = useState<NotificationItem[]>(initialItems);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    console.log('📋 NotiDrawer received initialItems:', initialItems);
  }, [initialItems]);

  useEffect(() => {
    console.log('🔄 NotiDrawer updating items from initialItems');
    setItems(prevItems => {
      const existingIds = new Set(prevItems.map(item => item.id));
      const newItems = initialItems.filter(item => !existingIds.has(item.id));
      const mergedItems = [...newItems, ...prevItems];
      console.log('🔀 Merged items:', mergedItems);
      return mergedItems;
    });
  }, [initialItems]);

  const unreadCount = useMemo(
    () => {
      const count = items.reduce((acc, it) => acc + (it.isRead ? 0 : 1), 0);
      console.log('🔢 Unread count:', count);
      return count;
    },
    [items]
  );

  const handleItemClick = (it: NotificationItem) => {
    console.log('👆 Clicked notification:', it);
    setItems(prev =>
      prev.map(x => (x.id === it.id ? { ...x, isRead: true } : x))
    );
    onItemClick?.(it);
  };

  const handleMarkAll = () => {
    console.log('📝 Marking all as read');
    setItems(prev => prev.map(x => ({ ...x, isRead: true })));
    onMarkAll?.(items);
  };

  return (
    <>
      <button
        type="button"
        className={iconClassName}
        onClick={() => {
          console.log('🎯 Opening notification drawer');
          setOpened(true);
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span className="ml-1 text-xs bg-red-500 text-white rounded-full px-1 min-w-[20px] inline-flex justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <Drawer 
        opened={opened} 
        onClose={() => {
          console.log('❌ Closing notification drawer');
          setOpened(false);
        }} 
        title="Notifications" 
        position="right"
        size="md"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-600">
            {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
          </span>
          {unreadCount > 0 && (
            <button className="text-sm text-blue-600 underline" onClick={handleMarkAll}>
              Mark all as read
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No notifications yet
          </div>
        ) : (
          <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
            {items.map((it) => (
              <li key={it.id} className={`border-l-4 ${it.isRead ? 'border-gray-300' : 'border-blue-500 bg-blue-50'}`}>
                <button
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-r"
                  onClick={() => handleItemClick(it)}
                >
                  <div className="text-sm">{it.description}</div>
                  {it.createdAt && (
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(it.createdAt).toLocaleString()}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Drawer>
    </>
  );
}