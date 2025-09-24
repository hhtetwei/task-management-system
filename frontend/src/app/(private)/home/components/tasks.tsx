'use client';

import { Button, Card, Loader, Text } from '@mantine/core';
import { useGetAllTasks } from '../api/get-tasks';
import { Tasks } from '../types';
import { FiEdit2 } from 'react-icons/fi';

const statuses = [
  { key: 'TODO', label: 'To Do' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'DONE', label: 'Done' },
];

export default function TaskBoard({  onEdit }: {  onEdit: (t: Tasks) => void }) {
  const { data, isLoading } = useGetAllTasks();

  if (isLoading) return <Loader className="mx-auto mt-10" />;

  return (
    <div className="w-full grid grid-cols-3 gap-2 p-5">
      {statuses.map((status) => {
        const tasks = data?.data.filter((task) => task.status === status.key);

        return (
          <Card key={status.key} >
            <Text fw={700} mb="md">
              {status.label}
            </Text>

            <div className="space-y-3">
              {tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                  <Card key={task.id} className="relative">
                    
                    <Button
                      type="button"
                      className="absolute right-2 top-2 p-2 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(task);
                      }}
                      aria-label="Edit task"
                      title="Edit"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </Button>

                    
                    <Text fw={600}>{task.title}</Text>
                    <Text size="sm" c="dimmed">
                      {task.description || 'No description'}
                    </Text>
                    <Text size="xs" c="blue">
                      Priority: {task.priority}
                    </Text>
                    <Text size="xs" c="gray">
                      Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                    </Text>
                  </Card>
                ))
              ) : (
                <Text size="sm" c="dimmed">
                  No tasks here
                </Text>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
