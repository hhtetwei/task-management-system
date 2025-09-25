
'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Stack, TextInput, Textarea, Select } from '@mantine/core'; 
import 'dayjs/locale/en';

import { Modal } from '@/app/components/ui/modal';
import { Button } from '@/app/components/ui/button';
import { toast } from '@/app/libs/toast';
import { useAuth } from '@/app/auth/auth-provider';
import { UserType } from '@/app/users/types';
import { useCreateTask } from '../api/create-task';
import { CreateTaskDto, createTaskSchema } from '../schemas/create-task';
import { useGetUsers } from '../../../users/api/get-users';
import { Priority, Status, Tasks } from '../types';
import { useUpdateTask } from '../api/update-task';
import DatePicker from '@/app/components/ui/date-picker';
import { queryClient } from '@/app/libs/react-query';

export default function TaskForm({
  isOpen,
  close,
  oldData,
}: {
  isOpen: boolean;
  close: () => void;
  oldData?: Tasks;
}) {
  const isEdit = Boolean(oldData);

  const { user } = useAuth();
  console.log('Current user:', user);
  const isAdmin = user?.type === UserType.ADMIN;
  const currentUserId = user?.id;

  const { data: usersPayload, isLoading: isLoadingUsers } = useGetUsers();
  const users =
    usersPayload?.data?.map((u) => ({ label: u.name, value: String(u.id) })) ?? [];

    const statusOptions = Object.values(Status).map((type) => ({
      label: type,
      value: type, 
    }));
    
    const priorityOptions = Object.values(Priority).map((type) => ({
      label: type,
      value: type,
    }));

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskDto>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      status: Status.TODO,
      priority: Priority.MEDIUM,
    } ,
  });

  useEffect(() => {
    if (!isOpen) return;

    if (oldData) {
      reset({
        title: oldData.title,
        description: oldData.description ?? '',
        status: oldData.status,
        priority: oldData.priority,
        dueDate: oldData.dueDate ? new Date(oldData.dueDate) : (undefined as any),
        assigneeId: oldData.assigneeId,
      });
    } else {
      reset({ status: Status.TODO, priority: Priority.MEDIUM });
    }
  }, [isOpen, oldData, reset]);

  const { mutate: createTask, isPending: creating } = useCreateTask();
  const { mutate: updateTask, isPending: updating } = useUpdateTask();

  const onSubmit = handleSubmit((payload) => {
    const assigneeId =
      isAdmin ? payload.assigneeId : currentUserId;

    if (!assigneeId) {
      toast.error({ message: 'Assignee is required' });
      return;
    }
    const finalPayload = {
      ...payload,
      assigneeId: String(assigneeId), 
      dueDate: payload.dueDate ? new Date(payload.dueDate).toISOString() : undefined,
    };

    if (isEdit && oldData) {
      updateTask(
        { id: oldData.id, data: finalPayload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['tasks'],
            });
            toast.success({ message: 'Task updated' });
            close();
          },
          onError: (e:any) => {
            toast.error({ message: e?.response?.data?.message ?? 'Update failed' });
          },
        }
      );
    } else {
      createTask(finalPayload, {
        onSuccess: () => {
          toast.success({ message: 'Task created' });
          close();
        },
        onError: (e: any) => {
          toast.error({ message: e?.response?.data?.message ?? 'Create failed' });
        },
      });
    }
  });

  return (
    <Modal
      title={isEdit ? 'Edit Task' : 'Create Task'}
      isOpen={isOpen}
      onClose={close}
      renderActionButton={() => null}
      size="lg"
    >
      <Card className="max-w-lg w-full">
        <form onSubmit={onSubmit}>
          <Stack gap="md">
            <TextInput
              label="Title"
              placeholder="Enter title"
              {...register('title')}
              error={errors.title?.message}
              withAsterisk
            />

            <Textarea
              label="Description"
              placeholder="Enter description"
              {...register('description')}
              error={errors.description?.message}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  label="Status"
                  data={statusOptions}
                  {...field}
                  error={errors.status?.message}
                  withAsterisk
                />
              )}
            />

            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  label="Priority"
                  data={priorityOptions}
                  {...field}
                  error={errors.priority?.message}
                  withAsterisk
                />
              )}
            />

            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                label="Due date"
                required
                value={field.value ?? ''}
                onChange={(v) => field.onChange(v)}
                error={errors.dueDate?.message}
                className="relative"
              />
              )}
            />

            {isAdmin && (
              <Controller
                name="assigneeId"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Assign to"
                    placeholder="Choose a user"
                    data={users}
                    searchable
                    disabled={isLoadingUsers}
                    value={field.value ? String(field.value) : null}
                    onChange={(v) => field.onChange(v ? Number(v) : undefined)}
                    error={errors.assigneeId?.message}
                  />
                )}
              />
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="outline" type="button" onClick={close}>
                Cancel
              </Button>
              <Button type="submit" loading={creating || updating}>
                {isEdit ? 'Save Changes' : 'Create'}
              </Button>
            </div>
          </Stack>
        </form>
      </Card>
    </Modal>
  );
}
