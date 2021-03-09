import React from 'react';
import MetaDecorator from '../../components/MetaDecorator/MetaDecorator';
import config from '../../lib/config';
import './Forbidden.css';

export default function Forbidden() {
  return (
    <div className='forbidden'>
      <MetaDecorator 
        title='Giá Rẻ Việt Nam - 403' 
        description='Bạn không được phép truy cập trang này'
        imageUrl={`${config.hostname}/logo.png`}
        pageUrl='/'
      />
      <h2>403</h2>
      <p>Xin lỗi, bạn không được phép xem trang này</p>
    </div>
  );
}
