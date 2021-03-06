import React from 'react';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import YouTubeIcon from '@material-ui/icons/YouTube';
import { makeStyles } from '@material-ui/styles'
import './Footer.css';

const useStyles = makeStyles({
  facebookIcon: {
    fill: '#3b5998',
    fontSize: '2rem',
    '@media (max-width: 550px)': {
      fontSize: '1.5rem'
    }
  },
  youtubeIcon: {
    fill: '#ff0000',
    fontSize: '2rem',
    '@media (max-width: 550px)': {
      fontSize: '1.5rem'
    }
  },
  instagramIcon: {
    fill: '#c13584',
    fontSize: '2rem',
    '@media (max-width: 550px)': {
      fontSize: '1.5rem'
    }
  }
});

function Footer() {
  const classes = useStyles();

  return (
    <footer className='footer'>
      <div className='footer__name'>
        <h1 className='footer__company-name'>Giá Rẻ</h1>
      </div>
      <div className='about footer__about'>
        <h2 className='footer__header'>Về Chúng Tôi</h2>
        <p className='about__description'>
          Giá Rẻ được tạo ra nhằm giúp người dùng chia sẻ thông tin về hàng giảm giá và cập nhật thông tin về những chương trình khuyến mãi.
          Giá Rẻ la website không lợi nhuận với mục tiêu giúp dỡ người tiêu dùng là chính.
        </p>
      </div>
      <div className='social-connections footer__connections'>
        <h2 className='footer__header'>Kết Nối</h2>
        <div className='social-connections__container'>
          <a href='https://www.facebook.com/giarevn.official' >
              <FacebookIcon className={classes.facebookIcon}/>
          </a>
          <a href='https://www.instagram.com/giarevn.official/'>
              <InstagramIcon className={classes.instagramIcon}/>
          </a>
          <a href='https://www.youtube.com/channel/UCEPzhKgpUk7s5R7UBYdHcew'>
            <YouTubeIcon className={classes.youtubeIcon}/>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
