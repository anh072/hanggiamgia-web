import React from 'react';
import MetaDecorator from '../../components/MetaDecorator/MetaDecorator';
import './Forbidden.css';

export default function Forbidden() {
  return (
    <div className='forbidden'>
      <MetaDecorator title='Giá Rẻ Việt Nam - 403' description='Bạn không được phép truy cập trang này'/>
      <h2>403</h2>
      <p>Xin lỗi, bạn không được phép xem trang này</p>
    </div>
  );
}
