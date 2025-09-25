import { Group, Pagination as MantinePagination } from '@mantine/core';

type Props = {
  value: number;
  total: number;
  onChange: (value: number) => void;
};

export const Pagination = (props: Props) => {
  return (
    <MantinePagination.Root {...props}>
      <Group gap={5} justify="center">
        <MantinePagination.First />
        <MantinePagination.Previous />
        <MantinePagination.Items />
        <MantinePagination.Next />
        <MantinePagination.Last />
      </Group>
    </MantinePagination.Root>
  );
};
