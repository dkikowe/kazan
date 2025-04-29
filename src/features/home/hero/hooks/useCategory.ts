// src/features/hero/hooks/useCategory.ts
"use client";

import { useState } from "react";

export function useCategory(initialId: string = "historical") {
  const [activeId, setActiveId] = useState(initialId);

  const isActive = (id: string) => activeId === id;

  const toggle = (id: string) => {
    setActiveId(id);
  };

  return { activeId, isActive, toggle };
}
