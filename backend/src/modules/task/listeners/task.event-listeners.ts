
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TASK_CREATED_EVENT, TASK_ASSIGNED_EVENT, TaskEventPayload } from '../domain/event';
import { TaskGateway } from '../socket/task.socket.gateway';

@Injectable()
export class TaskEventListener {
  constructor(private readonly taskGateway: TaskGateway) {}

  @OnEvent(TASK_CREATED_EVENT)
  handleTaskCreatedEvent(payload: TaskEventPayload) {
    console.log('🔥 Backend: Emitting task_created event', payload);
    this.taskGateway.notifyTaskCreated({
      ...payload,
      type: 'task_created',
      timestamp: new Date().toISOString(),
    });
  }

  @OnEvent(TASK_ASSIGNED_EVENT)
  handleTaskAssignedEvent(payload: TaskEventPayload) {
    console.log('🔥 Backend: Emitting task_assigned event', payload);
    
    if (payload.assigneeId) {
      console.log(`🔔 Notifying user ${payload.assigneeId} about task assignment`);
      this.taskGateway.notifyTaskAssigned(payload.assigneeId, {
        ...payload,
        type: 'task_assigned',
        timestamp: new Date().toISOString(),
      });
    }

    if (payload.prevAssigneeId && payload.prevAssigneeId !== payload.assigneeId) {
      console.log(`🔔 Notifying previous assignee ${payload.prevAssigneeId} about reassignment`);
      this.taskGateway.notifyTaskReassigned(payload.prevAssigneeId, {
        ...payload,
        type: 'task_reassigned_away',
        timestamp: new Date().toISOString(),
      });
    }
  }
}