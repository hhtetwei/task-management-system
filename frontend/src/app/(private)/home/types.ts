export enum Status {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export type Tasks = {
    id: number;
    title: string;
    description?: string;
    status: Status;
    priority: Priority;
    dueDate?: string;
    assigneeId?: number;
    assignee?: {
        id: number;
        name: string;
    }
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
  };
  
  export type GetTasksResponse = {
    data: Tasks[];
    count: number;
  };
  
  export type GetTasksDto = {
    skip?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    assigneeId?: number;
    page?: number;
    pageSize?: number;
  };
  
  