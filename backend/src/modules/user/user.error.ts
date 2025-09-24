
import { USER_ALREADY_EXIST, USER_NOT_FOUND } from '@/db/errors';
import { BadRequestException } from '@nestjs/common';

export const duplicateUserError = new BadRequestException(USER_ALREADY_EXIST);

export const notFoundUserError = new BadRequestException(USER_NOT_FOUND);