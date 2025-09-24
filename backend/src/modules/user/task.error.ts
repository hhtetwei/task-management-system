

import { TASK_ALREADY_EXIST, TASK_NOT_ALLOWED, TASK_NOT_FOUND } from '@/db/errors';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

export const duplicateTaskError = new BadRequestException(TASK_ALREADY_EXIST);

export const notFoundTaskError = new BadRequestException(TASK_NOT_FOUND);

export const notAllowedToUpdateTask = new ForbiddenException(TASK_NOT_ALLOWED);