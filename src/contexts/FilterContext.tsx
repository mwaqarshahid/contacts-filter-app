import {createContext, ReactNode, useState} from "react";

export type Filter = {
  minMessagesRecv?: number,
  maxMessagesRecv?: number,
  minMessagesSent?: number,
  maxMessagesSent?: number,
  notTags?: string[],
  tags?: string[]
};

export const initialFilters = {
  minMessagesRecv: undefined,
  maxMessagesRecv: undefined,
  minMessagesSent: undefined,
  maxMessagesSent: undefined,
  notTags: [],
  tags: [],
};

const FilterContext = createContext({
  filters: initialFilters, setFilters: (params: any) => {
  }
});

const FilterProvider = ({children}: { children: ReactNode }) => {
  const [filters, setFilters] = useState(initialFilters);

  return (
    <FilterContext.Provider value={{filters, setFilters}}>
      {children}
    </FilterContext.Provider>
  )
}

export {
  FilterProvider,
  FilterContext
}