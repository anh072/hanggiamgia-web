import React from 'react';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import { makeStyles } from '@material-ui/styles'
import './Footer.css';

const useStyles = makeStyles({
  facebookIcon: {
    fill: '#3b5998',
    fontSize: '2rem'
  },
  twitterIcon: {
    fill: '#1da1f2',
    fontSize: '2rem'
  },
  instagramIcon: {
    fill: '#c13584',
    fontSize: '2rem'
  }
});

function Footer() {
  const classes = useStyles();

  return (
    <footer className='footer'>
      <div className='footer__name'>
        <h1 className='footer__company-name'>Gia Re</h1>
      </div>
      <div className='about footer__about'>
        <h2 className='footer__header'>About Us</h2>
        <p className='about__description'>
          Gia Re is built to provide the community with a channel to share discounted products and services. 
          Our commitment is to help people spend money smarter and stay alerted to sales.
        </p>
      </div>
      <div className='social-connections footer__connections'>
        <h2 className='footer__header'>Stay Connected!</h2>
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
