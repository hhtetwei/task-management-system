
'use client';

import { Card, Text } from '@mantine/core';
import { Modal } from '@/app/components/ui/modal';
import { Button } from '@/app/components/ui/button';
import { toast } from '@/app/libs/toast';
import { useDeleteTask } from '../api/delete-task';
import { Tasks } from '../types';
import { queryClient } from '@/app/libs/react-query';

export default function DeleteTask({
  isOpen,
  close,
  task,
}: {
  isOpen: boolean;
  close: () => void;
  task?: Tasks;   
}) {
  const { mutate, isPending } = useDeleteTask();

  const onConfirm = () => {
    if (!task) return;
    mutate({ id: task.id }, {
      onSuccess: () => {
        toast.success({ message: 'Task deleted successfully' });
        queryClient.invalidateQueries({
            queryKey: ['tasks'],
          });
        close();
      },
      onError: (err: any) => {
        toast.error({
          message: err?.response?.data?.message ?? 'Failed to delete task',
        });
      },
    });
  };

  return (
    <Modal
      title="Delete Task"
      isOpen={isOpen}
      onClose={close}
      renderActionButton={() => null}
      size="sm"
    >
      <Card className="max-w-md w-full">
        <Text className="mb-4">
          This will permanently delete{' '}
          <span className="font-semibold">“{task?.title ?? 'this task'}”</span>.
          Are you sure?
        </Text>

        <div className="flex w-full gap-2">
          <Button onClick={onConfirm} loading={isPending} className="bg-red-600 text-white w-full">
            Delete
          </Button>
        </div>
      </Card>
    </Modal>
  );
}
