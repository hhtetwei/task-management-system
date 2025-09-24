'use client';

import { useState, FormEvent } from 'react';
import { Avatar, Menu, UnstyledButton } from '@mantine/core';
import { FiMenu } from 'react-icons/fi';
import { IoMdAdd } from 'react-icons/io';
import { useAuth } from '../auth/auth-provider';
import NotiDrawer from './noti-drawer';
import { useRouter } from 'next/navigation';
import CreateTask from '../(private)/home/components/task-form';

type TopbarProps = { toggle?: () => void };

export const Topbar = ({ toggle = () => {} }: TopbarProps) => {
  const router = useRouter();
  const { user, logout: onLogout } = useAuth();

  const [showCreate, setShowCreate] = useState(false);

  const [q, setQ] = useState('');

  const onSignOut = async () => {
    try {
      await onLogout?.();
      router.replace('/auth/login');
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 text-gray-900 border-b border-gray-200">
      <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-5">
        <div className="flex items-center gap-3 sm:gap-4">
        

          <span className="hidden sm:inline-block text-sm font-semibold tracking-wide">
            Task Assistant
          </span>

         
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <form onSubmit={onSearch} className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search issues, tasks…"
              className="w-44 sm:w-64 md:w-80 h-9 rounded-md border border-gray-300 bg-white pl-3 pr-8 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100"
            >
           
              <span className="text-base">🔍</span>
            </button>
          </form>

          <NotiDrawer
            iconClassName="text-gray-500"
            initialItems={[
              { id: 1, description: 'Admin assigned issue #254 to you', createdAt: new Date(), isRead: false },
              { id: 2, description: 'Order #A-991 requested cancel', createdAt: new Date(), isRead: true },
            ]}
            onItemClick={(item) => console.log('clicked', item)}
            onMarkAll={(items) => console.log('marked all', items)}
          />


          {user && (
            <Menu>
              <Menu.Target>
                <UnstyledButton className="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-gray-100">
                  <Avatar
                    size="md"
                    name={`${user.name ?? ''}`}
                    color="white"
                    className="border border-gray-300"
                  />
                  <div className="hidden sm:flex flex-col text-left leading-tight">
                    <span className="text-sm">{user.name}</span>
                    <span className="text-[11px] text-gray-500">{user.email}</span>
                  </div>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item onClick={() => router.push('/profile')}>Profile</Menu.Item>
                <Menu.Item onClick={onSignOut}>Logout</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </div>
      </div>
    </div>
  );
};
