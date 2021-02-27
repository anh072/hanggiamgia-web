import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import CategoryAPI from './api/CategoryAPI';
import ReasonAPI from './api/ReportAPI';

export const GlobalState = React.createContext();

export function DataProvider({children, initialProps}) {
  let state = {};
  if (initialProps) {
    state = {
      categoryStore: initialProps.categories,
      reasonStore: initialProps.reasons
    }
  } else {
    state = {
      categoryStore: CategoryAPI(),
      reasonStore: ReasonAPI()
    }
  }
  
  return (
    <GlobalState.Provider value={state}>
      { children }
    </GlobalState.Provider>
  );
}

DataProvider.defaultProps = {
  initialProps: null
};

DataProvider.propTypes = {
  children: PropTypes.node,
  initialProps: PropTypes.object
};

export const useDataProvider = () => useContext(GlobalState);
