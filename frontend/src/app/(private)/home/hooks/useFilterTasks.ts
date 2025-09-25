'use client';

import { useBaseFilter } from "@/app/hooks/useBaseFilter";
import { usePathname, useRouter } from "next/navigation";

export const useFilterTasks = () => {
  const base = useBaseFilter('');
  const params = base.getAllSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const updateUrl = (updates: Record<string, string | number | null>) => {
    const newParams = { ...params, ...updates };
    
    Object.keys(newParams).forEach(key => {
      if (newParams[key] === null || newParams[key] === undefined || newParams[key] === '') {
        delete newParams[key];
      }
    });
    
    const sp = new URLSearchParams();
    Object.entries(newParams).forEach(([key, value]) => {
      sp.set(key, String(value));
    });
    
    const queryString = sp.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    
    router.replace(newUrl, { scroll: false });
  };

  const filterByStatus = (value: string | null) => {
    updateUrl({ 
      status: value === 'ALL' || !value ? null : value,
      page: 1 
    });
  };

  const filterByPriority = (value: string | null) => {
    updateUrl({ 
      priority: value || null,
      page: 1 
    });
  };

  const setPage = (page: number) => {
    updateUrl({ page });
  };

  const clearFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  return {
    ...base,
    search: params.search ?? '',
    status: params.status ?? 'ALL',       
    priority: params.priority ?? '',   
    page: Number(params.page ?? 1),
    limit: Number(params.limit ?? 10),
    setSearch: base.onSearch,
    filterByStatus,
    filterByPriority,
    setPage,
    clearFilters,
  };
};