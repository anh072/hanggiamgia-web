import React, { useEffect } from 'react';
import moment from 'moment';
import Pages from './pages/Pages';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import config from './lib/config';
import './App.css';

function App() {

  useEffect(() => {
    moment.locale('vi', {
      weekdays: 'Thứ 2_Thứ 3_Thứ 4_Thứ 5_Thứ 6_Thứ 7_Chủ Nhật'.split('_'),
      relativeTime: {
        past : '%s trước',
        s : 'vài giây',
        m : '1 phút',
        mm : '%d phút',
        h : '1 giờ',
        hh : '%d giờ',
        d : '1 ngày',
        dd : '%d ngày',
        M : '1 tháng',
        MM : '%d tháng',
        y : '1 năm',
        yy : '%d năm'
      }
    });
    moment.tz.setDefault(config.localTimezone);
  }, []);

  return (
    <div className="App">
      <Header />
      <Pages />
      <Footer />
    </div>
  );
}

export default App;
