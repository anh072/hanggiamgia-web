import React, { useState } from 'react';
import PropTypes from 'prop-types'; 
import './Tab.css';

export const TabContext = React.createContext();

export default function Tab(props) {
  const [ value, setValue ] = useState(() => {
    if (props.value) return props.value;
    return 0;
  });

  const handleClick = (e, newValue) => {
    setValue(newValue);
    if (props.onChange && typeof(props.onChange) == "function") props.onChange(e, newValue);
  };

  return (
    <div className={`tab-container ${props.classname ? `${props.classname}` : ''}`}>
      <TabContext.Provider value={value}>
        {
          React.Children.map(props.children, (child, index) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { index: index, onClick: handleClick });
            }
            return child;
          })
        }
      </TabContext.Provider>
    </div>
  );
}

Tab.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  classname: PropTypes.string
};
