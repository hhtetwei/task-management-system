import TaskBoard from '@/app/(private)/home/components/tasks';
import { render, screen } from '@testing-library/react';
import { Providers } from '@/app/providers';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/mock-path',
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('@/app/(private)/home/api/get-tasks', () => ({
  useGetAllTasks: () => ({
    data: { data: [{ id: 1, title: 'Test Task', status: 'TODO', priority: 'HIGH' }], count: 1 },
    isLoading: false,
    error: null,
  }),
}));

describe('TaskBoard', () => {
  it('renders a task from mocked API', () => {
    render(
      <Providers>
        <TaskBoard onEdit={jest.fn()} onDelete={jest.fn()} />
      </Providers>
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
