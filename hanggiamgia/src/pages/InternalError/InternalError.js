import { requirePropFactory } from '@material-ui/core';
import React from 'react';
import logo from './logo192.png';
import './InternalError.css';

function InternalError() {
  return (
    <div className='internal-error'>
      <img className='internal-error__logo' alt='internal error' src={logo} />
      <h2>500</h2>
      <p>An internal error occured</p>
    </div>
  )
}

export default InternalError;
