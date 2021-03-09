import React from 'react';
import logo from '../../images/logo.png';
import MetaDecorator from '../../components/MetaDecorator/MetaDecorator';
import './InternalError.css';

function InternalError() {
  return (
    <div className='internal-error'>
      <MetaDecorator title='Giá Rẻ Việt Nam - 500' description='Đây là trang 500. Server hiện đang bị lỗi'/>
      <img className='internal-error__logo' alt='internal error' src={logo} />
      <h2>500</h2>
      <p>Server bị lỗi</p>
    </div>
  )
}

export default InternalError;
