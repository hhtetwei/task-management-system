
import { ReactNode } from 'react';
import { notifications } from '@mantine/notifications';

type ShowArgs = Parameters<typeof notifications.show>[0];
type Position = NonNullable<ShowArgs['position']>;

type Options = ShowArgs & {
  message: ReactNode; 
};

const defaultOpts: Partial<Options> = {
  withCloseButton: true,
  position: 'top-right' as Position,
  autoClose: 3000,
};

export const toast = {
  show(opt: Options) {
    notifications.show({ ...defaultOpts, ...opt });
  },
  success(opt: Options) {
    this.show({ color: 'green', ...opt });
  },
  error(opt: Options) {
    this.show({ color: 'red', ...opt });
  },
};
