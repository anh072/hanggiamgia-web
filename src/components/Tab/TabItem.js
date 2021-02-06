import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { TabContext } from './Tab';
import './TabItem.css';

function TabItem(props) {
  const value = useContext(TabContext);

  return (
    <button 
      onClick={(e) => props.onClick(e, props.value)}
      className={`tab-item ${props.value === value || props.index === value ? 'tab-item_selected' : ''}`}>
        {props.label}
    </button>
  );
}

TabItem.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  index: PropTypes.number,
  onClick: PropTypes.func
};

export default TabItem;
