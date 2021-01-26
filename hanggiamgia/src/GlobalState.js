import React, { useState, useContext } from 'react';
import CategoryAPI from './api/CategoryAPI';
import ReasonAPI from './api/ReportAPI';

export const GlobalState = React.createContext();

export function DataProvider({children}) {
  const [ category, setCategory ] = useState("");
  const [ searchTerm, setSearchTerm ] = useState("");

  const state = {
    categoryStore: CategoryAPI(),
    reasonStore: ReasonAPI(),
    selectedCategory: [category, setCategory],
    searchTerm: [searchTerm, setSearchTerm]
  };
  
  return (
    <GlobalState.Provider value={state}>
      {children}
    </GlobalState.Provider>
  );
}

export const useDataProvider = () => useContext(GlobalState);
