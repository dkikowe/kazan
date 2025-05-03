// src/features/hero/hooks/useCategory.ts
"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const useCategory = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const router = useRouter();

  const toggle = useCallback((id: string) => {
    setActiveId(id);
    router.push(`/catalog?tag=${id}`);
  }, [router]);

  return { activeId, toggle };
};
