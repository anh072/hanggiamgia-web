import React, { useContext } from 'react';
import CategoryAPI from './api/CategoryAPI';
import ReasonAPI from './api/ReportAPI';
import InternalError from './pages/InternalError/InternalError';

export const GlobalState = React.createContext();

export function DataProvider({children}) {

  const state = {
    categoryStore: CategoryAPI(),
    reasonStore: ReasonAPI(),
  };

  const renderContent = () => {
    if (state.categoryStore.error || state.reasonStore.error)
      return <InternalError />;
    return children
  };
  
  return (
    <GlobalState.Provider value={state}>
      { renderContent() }
    </GlobalState.Provider>
  );
}

export const useDataProvider = () => useContext(GlobalState);
