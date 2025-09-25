
'use client';

import { useEffect, useState, FormEvent, useCallback, useMemo } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { Avatar, Menu, UnstyledButton } from '@mantine/core';
import { useAuth } from '../auth/auth-provider';
import NotiDrawer from './noti-drawer';
import { useRouter } from 'next/navigation';
import { useFilterTasks } from '../(private)/home/hooks/useFilterTasks';
import { TaskEventPayload, useTasksSocket } from '../libs/task-sockets';

type NotificationItem = {
  id: number | string;
  description: string;
  createdAt?: string | Date;
  isRead?: boolean;
};

export const Topbar = ({ toggle }: { toggle: () => void }) => {
  const router = useRouter();
  const { user, logout: onLogout } = useAuth();

  const [notis, setNotis] = useState<NotificationItem[]>([]);

  useEffect(() => {
    console.log('📢 Notifications updated:', notis);
  }, [notis]);

  const { search: searchParam, setSearch } = useFilterTasks();
  const [query, setQuery] = useState(searchParam);
  useEffect(() => setQuery(searchParam), [searchParam]);
  const [dq] = useDebouncedValue(query, 350);
  useEffect(() => { if ((searchParam ?? '') !== (dq ?? '')) setSearch(dq || undefined); }, [dq, searchParam, setSearch]);
  const onSubmit = (e: FormEvent) => { e.preventDefault(); setSearch(query || undefined); };

  const onSignOut = async () => { try { await onLogout?.(); router.replace('/login'); } catch {} };

  const pushNoti = useCallback((text: string) => {
    console.log('🚀 Pushing new notification:', text);
    setNotis(prev => {
      const newNoti = { 
        id: Date.now() + Math.random(), 
        description: text, 
        createdAt: new Date(), 
        isRead: false 
      };
      const updatedNotis = [newNoti, ...prev];
      console.log('📝 Updated notifications array:', updatedNotis);
      return updatedNotis;
    });
  }, []);

  const onTaskCreated = useCallback((p: TaskEventPayload) => {
    console.log('🎉 Task created event received:', p);
    pushNoti(`Task created: ${p.title} (${p.priority})`);
  }, [pushNoti]);

  const onTaskAssigned = useCallback((p: TaskEventPayload) => {
    console.log('🎯 Task assigned event received:', p);
    const due = p.dueDate ? ` — due ${new Date(p.dueDate).toLocaleDateString()}` : '';
    pushNoti(`New task assigned: ${p.title}${due}`);
  }, [pushNoti]);

  const onTaskReassignedAway = useCallback((p: TaskEventPayload) => {
    console.log('🔄 Task reassigned away event received:', p);
    pushNoti(`Task reassigned away: ${p.title}`);
  }, [pushNoti]);

  const effectiveUser = useMemo(() => user?.data || user, [user]);
  const userId = effectiveUser?.id;

  const stableCallbacks = useMemo(() => ({
    onTaskCreated,
    onTaskAssigned,
    onTaskReassignedAway,
  }), [onTaskCreated, onTaskAssigned, onTaskReassignedAway]);

  const socketStatus = useTasksSocket({
    userId: userId,
    ...stableCallbacks,
  });

  useEffect(() => {
    console.log('🔌 Socket status:', socketStatus);
  }, [socketStatus]);

  const userName = effectiveUser?.name || 'User';
  const userEmail = effectiveUser?.email || '';

  return (
    <div className="fixed inset-x-0 top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 text-gray-900 border-b border-gray-200">
      <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden sm:inline-block text-sm font-semibold">Task Assistant</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <form onSubmit={onSubmit} className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search task title…"
              className="w-44 sm:w-64 md:w-80 h-9 rounded-md border border-gray-300 bg-white pl-3 pr-8 text-sm outline-none focus:border-gray-400"
            />
            <button type="submit" className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100">
              <span className="text-base">🔍</span>
            </button>
          </form>

          <div className="flex items-center gap-2">
           
            <NotiDrawer
              iconClassName="text-gray-500"
              initialItems={notis}
              onItemClick={(item) => {
                console.log('Clicked noti item', item)
              }}
              onMarkAll={(items) => {
                console.log('Mark all items:', items)
              }}  
            />
          </div>

          {effectiveUser && (
            <Menu>
              <Menu.Target>
                <UnstyledButton className="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-gray-100">
                  <Avatar size="md" name={userName} color="white" className="border border-gray-300" />
                  <div className="flex flex-col">
                    <span className="text-sm text-black">{userName}</span>
                    <span className="text-[11px] text-gray-500">{userEmail}</span>
                  </div>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={onSignOut}>Logout</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </div>
      </div>
    </div>
  );
};