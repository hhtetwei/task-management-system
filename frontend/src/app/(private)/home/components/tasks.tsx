'use client';

import { Button, Card, Loader, Text, Tabs, Pagination, Group, Badge, Select } from '@mantine/core';
import { useGetAllTasks } from '../api/get-tasks';
import { Tasks, Priority } from '../types';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useFilterTasks } from '../hooks/useFilterTasks';

const statusConfig = [
  { key: 'TODO', label: 'To Do', color: 'gray' },
  { key: 'IN_PROGRESS', label: 'In Progress', color: 'blue' },
  { key: 'DONE', label: 'Done', color: 'green' },
];

const priorityConfig = [
  { value: 'LOW', label: 'Low', color: 'blue' },
  { value: 'MEDIUM', label: 'Medium', color: 'yellow' },
  { value: 'HIGH', label: 'High', color: 'red' },
];

const ITEMS_PER_PAGE = 9;

export default function TaskBoard({
  onEdit,
  onDelete,
}: {
  onEdit: (t: Tasks) => void;
  onDelete: (t: Tasks) => void;
}) {
  const {
    status,
    priority,
    search,
    page,
    setSearch,
    filterByStatus,
    filterByPriority,
    setPage,
    clearFilters,
  } = useFilterTasks();

  const currentPage = page;

  const { data, isLoading, error } = useGetAllTasks({
    search: search || undefined, 
    status: status === 'ALL' ? undefined : status,
    priority: priority || undefined,
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
  });

  if (isLoading) return <Loader className="mx-auto mt-10" size="lg" />;
  if (error) return <Text c="red" className="text-center mt-10">Error loading tasks</Text>;

  const tasks = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  if (currentPage > totalPages && totalPages > 0) {
    setPage(1);
  }

  const getFilterDescription = () => {
    const statusLabel = status === 'ALL' 
      ? 'All Tasks' 
      : statusConfig.find(s => s.key === status)?.label;
    
    const priorityLabel = priority 
      ? priorityConfig.find(p => p.value === priority)?.label 
      : null;

    let description = statusLabel || 'All Tasks';
    
    if (priorityLabel) {
      description += ` - ${priorityLabel} Priority`;
    }
    
    if (search) {
      description += ` matching "${search}"`;
    }

    return description;
  };

  const getPriorityColor = (taskPriority: Priority) => {
    switch (taskPriority) {
      case 'HIGH': return 'red';
      case 'MEDIUM': return 'yellow';
      case 'LOW': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <div className="w-full p-5 space-y-6">
      <Card withBorder className="space-y-4">
        <Tabs
          value={status}
          onChange={(val) => {
            filterByStatus(val || 'ALL');
          }}
        >
          <Tabs.List grow>
            <Tabs.Tab value="ALL">
              <Group gap="xs">
                <Text>All Tasks</Text>
                <Badge size="sm" variant="light">{totalCount}</Badge>
              </Group>
            </Tabs.Tab>
            {statusConfig.map((s) => (
              <Tabs.Tab key={s.key} value={s.key}>
                <Group gap="xs">
                  <Text>{s.label}</Text>
                </Group>
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>

    
      </Card>

      <div className="mt-6">
        <Text size="lg" fw={500} mb="md">
          {getFilterDescription()}
          {totalCount > 0 && ` (${tasks.length} of ${totalCount})`}
        </Text>

        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task: Tasks) => {
              const statusInfo = statusConfig.find(s => s.key === task.status);
              const priorityInfo = priorityConfig.find(p => p.value === task.priority);
              
              return (
                <Card
                  key={task.id}
                  withBorder
                  className="relative border-l-4 hover:shadow-md transition-shadow"
                  style={{ borderLeftColor: `var(--mantine-color-${statusInfo?.color}-6)` }}
                >
                  <Badge color={statusInfo?.color} variant="light" className="absolute right-2 top-2">
                    {statusInfo?.label}
                  </Badge>

                  <div className="absolute right-2 top-10 flex gap-1">
                    <Button
                      variant="subtle"
                      size="xs"
                      onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                    >
                      <FiEdit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="subtle"
                      size="xs"
                      color="red"
                      onClick={(e) => { e.stopPropagation(); onDelete(task); }}
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  <Text fw={600} className="pr-20 mb-2">{task.title}</Text>
                  <Text size="sm" c="dimmed" lineClamp={2}>
                    {task.description || 'No description'}
                  </Text>

                  <div className="mt-3 space-y-1">
                    <Group justify="space-between">
                      <Text size="xs" fw={500} c="blue">Priority:</Text>
                      <Badge 
                        size="xs" 
                        variant="outline" 
                        color={getPriorityColor(task.priority)}
                      >
                        {priorityInfo?.label || task.priority}
                      </Badge>
                    </Group>
                    <Group justify="space-between">
                      <Text size="xs" fw={500} c="gray">Due Date:</Text>
                      <Text size="xs" c="gray">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                      </Text>
                    </Group>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card withBorder className="text-center py-10">
            <Text size="lg" c="dimmed">No tasks found</Text>
            <Text size="sm" c="dimmed" mt="xs">
              {status === 'ALL' && !priority && !search
                ? 'There are no tasks available.'
                : `There are no tasks matching your current filters.`}
            </Text>
            {(status !== 'ALL' || priority || search) && (
              <Button
                variant="subtle"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear filters
              </Button>
            )}
          </Card>
        )}
      </div>

      
        <Card className="sticky bottom-0 bg-white">
          <Pagination
            value={currentPage}
            total={totalPages}
            onChange={setPage}
            className="flex justify-center"
          />
        </Card>
      
    </div>
  );
}