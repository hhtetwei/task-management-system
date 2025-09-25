'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import type { DatesRangeValue } from '@mantine/dates';

type AnyRecord = Record<string, unknown>;

const removeFalsyValues = (params: AnyRecord) => {
  const final = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    final.set(key, String(value));
  });
  return final;
};

export const useBaseFilter = (prefix = '') => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); 

  const getAllSearchParams = useCallback((): Record<string, string> => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (prefix === '' || key.startsWith(prefix)) {
        const cleanKey = prefix ? key.replace(prefix, '') : key;
        params[cleanKey] = value;
      }
    });
    return params;
  }, [searchParams, prefix]);
    
  const commit = useCallback((obj: AnyRecord) => {
    const current = new URLSearchParams(searchParams.toString());
    if (prefix) {
      Array.from(current.keys()).forEach((k) => {
        if (k.startsWith(prefix)) current.delete(k);
      });
    }

    const next = removeFalsyValues({
      ...Object.fromEntries(current.entries()),
      ...obj,
    });

    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }, [router, pathname, searchParams, prefix]);

  const onSearch = useCallback((value?: string) => {
    commit({
      [`${prefix}page`]: 1,
      [`${prefix}search`]: value,
    });
  }, [commit, prefix]);

  const clearParams = useCallback(() => {
    if (!prefix) {
      router.replace(pathname, { scroll: false });
      return;
    }
    const current = new URLSearchParams(searchParams.toString());
    Array.from(current.keys()).forEach((k) => {
      if (k.startsWith(prefix)) current.delete(k);
    });
    router.replace(`${pathname}?${current.toString()}`, { scroll: false });
  }, [router, pathname, searchParams, prefix]);

  const onDateRangeChange = useCallback(
    (value: Date[] | DatesRangeValue | null) => {
      if (!value) return;
      const [start, end] = value as DatesRangeValue;

      if (start && end) {
        commit({
          [`${prefix}page`]: 1,
          [`${prefix}start`]: dayjs(start).toISOString(),
          [`${prefix}end`]: dayjs(end).add(1, 'day').toISOString(),
        });
      } else {
        commit({
          [`${prefix}page`]: 1,
          [`${prefix}start`]: null,
          [`${prefix}end`]: null,
        });
      }
    },
    [commit, prefix]
  );

  const onPaginate = useCallback((page?: number) => {
    if (!page) return;
    commit({ [`${prefix}page`]: page });
  }, [commit, prefix]);

  return {
    onSearch,
    onPaginate,
    onDateRangeChange,
    getAllSearchParams,
    clearParams,

    searchParams,
  };
};
