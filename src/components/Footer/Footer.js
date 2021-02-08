import React from 'react';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
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
  twitterIcon: {
    fill: '#1da1f2',
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
          <a href='https://www.facebook.com/profile.php?id=100000278872468' >
              <FacebookIcon className={classes.facebookIcon}/>
          </a>
          <a href='https://www.instagram.com/anh_nguyen072'>
              <InstagramIcon className={classes.instagramIcon}/>
          </a>
          <a href='https://twitter.com/anhnguyen072'>
            <TwitterIcon className={classes.twitterIcon}/>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
