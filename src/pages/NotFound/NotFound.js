import React from 'react';
import { Link } from 'react-router-dom';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import MetaDecorator from '../../components/MetaDecorator/MetaDecorator';
import './NotFound.css';

const useStyles = makeStyles({
  sadIcon: {
    fontSize: '3rem',
    color: '#FAB81E'
  }
});

export default function NotFound() {
  const classes = useStyles();

  return (
    <div className='not-found'>
      <MetaDecorator title='Giá Rẻ Việt Nam - 404' description='Đây là trang 404. Trang bạn truy cập không tồn tại'/>
      <SentimentVeryDissatisfiedIcon className={classes.sadIcon} />
      <h2 className='not-found__title'>Ooups, trang không tồn tại</h2>
      <p>Hình như bạn đang truy cập trang không tồn tại</p>
      <Link to='/'>
        <Button color='primary' variant='contained'>Trang chủ</Button>
      </Link>
    </div>
  );
}
