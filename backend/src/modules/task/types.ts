import { Task } from "./task.entity";

export enum TaskStatus { TODO = 'TODO', IN_PROGRESS = 'IN_PROGRESS', DONE = 'DONE' }

export enum TaskPriority { LOW = 'LOW', MEDIUM = 'MEDIUM', HIGH = 'HIGH' }

export type GetTaskResponse = { data: Task[]; count: number };