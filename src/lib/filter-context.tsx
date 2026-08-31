"use client";

import React, { createContext, useContext, useState } from "react";

export type UrgencyLevel = "high" | "medium" | "low";
export type ResourceType = "food" | "water" | "shelter" | "medical" | null;

interface FilterContextType {
  urgency: UrgencyLevel;
  setUrgency: (u: UrgencyLevel) => void;
  resource: ResourceType;
  setResource: (r: ResourceType) => void;
}

const FilterContext = createContext<FilterContextType>({
  urgency: "high",
  setUrgency: () => {},
  resource: null,
  setResource: () => {},
});

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [urgency, setUrgency] = useState<UrgencyLevel>("high");
  const [resource, setResource] = useState<ResourceType>(null);

  return (
    <FilterContext.Provider value={{ urgency, setUrgency, resource, setResource }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  return useContext(FilterContext);
}
