export type TaskEventPayload = {
    id: number;
    title: string;
    status: string;
    priority: string;
    dueDate?: string;
    assigneeId?: number | null;
    prevAssigneeId?: number | null; 
  };
  
  export const TASK_CREATED_EVENT  = 'task.created';
export const TASK_ASSIGNED_EVENT = 'task.assigned';
export const TASK_UPDATED_EVENT = 'task.updated';