import React, { useContext } from 'react';
import CategoryAPI from './api/CategoryAPI';
import PostAPI from './api/PostAPI';
import ReasonAPI from './api/ReportAPI';

export const GlobalState = React.createContext();

export function DataProvider({children}) {
  const state = {
    postApi: PostAPI(),
    categoryApi: CategoryAPI(),
    reasonApi: ReasonAPI()
  };
  
  return (
    <GlobalState.Provider value={state}>
      {children}
    </GlobalState.Provider>
  );
}

export const useDataProvider = () => useContext(GlobalState);
