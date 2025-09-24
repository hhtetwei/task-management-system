import { QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from './toast';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        if (isAxiosError(error)) {
          const { response } = error;
          toast.error({
            message: response?.data.message ?? 'Internal server error.',
          });
        } else {
          toast.error({ message: 'Something went wrong.' });
        }
      },
    },
  },
});
