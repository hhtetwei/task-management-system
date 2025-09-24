// notiDrawer.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IoNotifications } from 'react-icons/io5';

type NotificationItem = {
  id: number | string;
  description: string;
  createdAt?: string | Date;
  isRead?: boolean;
};

type NotiDrawerProps = {
  /** Seed the UI; no network calls are made. */
  initialItems?: NotificationItem[];
  /** Optional class override for the bell icon */
  iconClassName?: string;
  /** Adjust the little red badge position */
  badgeOffset?: { top?: number; right?: number };
  /** Called when an item is clicked (after local mark-read) */
  onItemClick?: (item: NotificationItem) => void;
  /** Called when "Mark all as read" is pressed (after local mark-read) */
  onMarkAll?: (items: NotificationItem[]) => void;
};

const cn = (...s: Array<string | false | null | undefined>) => s.filter(Boolean).join(' ');

export default function NotiDrawer({
  initialItems = [],
  iconClassName,
  badgeOffset = { top: -6, right: -6 },
  onItemClick,
  onMarkAll,
}: NotiDrawerProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(
      initialItems.map((i) => ({
        ...i,
        isRead: Boolean(i.isRead),
      }))
    );
  }, [initialItems]);

  const unreadCount = useMemo(
    () => items.filter((i) => !i.isRead).length,
    [items]
  );

  const markAll = () => {
    if (unreadCount === 0) return;
    setItems((prev) => prev.map((i) => ({ ...i, isRead: true })));
    onMarkAll?.(items.map((i) => ({ ...i, isRead: true })));
  };

  const handleItemClick = (target: NotificationItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === target.id ? { ...i, isRead: true } : i))
    );
    onItemClick?.({ ...target, isRead: true });
    // You can close here if you want:
    // close();
  };

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Notifications" position="right" keepMounted>
        <div className="flex flex-col gap-3">
          <div className="flex justify-end">
            <button
              onClick={markAll}
              disabled={unreadCount === 0}
              className={cn(
                'px-3 py-1 rounded-md text-white text-xs',
                unreadCount ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
              )}
            >
              Mark all as read
            </button>
          </div>

          <div ref={scrollerRef} className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1">
            {items.length === 0 && (
              <div className="text-sm text-gray-500 text-center py-8">
                No notifications yet.
              </div>
            )}

            {items.map((n) => (
              <div
                key={n.id}
                className={cn(
                  'p-3 rounded-lg cursor-pointer border transition-colors',
                  n.isRead
                    ? 'bg-gray-100 border-gray-200'
                    : 'bg-yellow-100 border-yellow-200'
                )}
                onClick={() => handleItemClick(n)}
              >
                <div className="text-sm">{n.description}</div>
                {n.createdAt && (
                  <div className="text-[11px] opacity-60 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Drawer>

      <div className="relative">
        {unreadCount > 0 && (
          <div
            className="absolute bg-red-500 text-white h-5 w-5 flex justify-center items-center rounded-full text-[11px] font-medium"
            style={{ right: badgeOffset.right ?? -6, top: badgeOffset.top ?? -6 }}
          >
            {unreadCount}
          </div>
        )}
       <IoNotifications
  className={cn('text-2xl cursor-pointer text-gray-500', iconClassName)}
  onClick={open}
  aria-label="Open notifications"
/>
      </div>
    </>
  );
}
