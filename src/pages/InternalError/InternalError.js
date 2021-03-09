import React from 'react';
import logo from '../../images/logo.png';
import './InternalError.css';

function InternalError() {
  return (
    <div className='internal-error'>
      <img className='internal-error__logo' alt='internal error' src={logo} />
      <h2>500</h2>
      <p>Server bị lỗi</p>
    </div>
  )
}

export default InternalError;
