import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddBoxTwoToneIcon from '@material-ui/icons/AddBoxTwoTone';
import IndeterminateCheckBoxTwoToneIcon from '@material-ui/icons/IndeterminateCheckBoxTwoTone';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import LabelIcon from '@material-ui/icons/Label';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import LinkIcon from '@material-ui/icons/Link';
import DateRangeIcon from '@material-ui/icons/DateRange';
import moment from 'moment';
import { Link } from 'react-router-dom';
import psl from 'psl';
import PropTypes from 'prop-types';
import ReportButton from '../ReportButton/ReportButton';
import config from '../../lib/config';
import { isWithinAWeek } from '../../lib/common';
import NoImage from '../../images/no-image-available.png';
import './PostItem.css';

const getDomainName = (url) => {
  var hostname;

  if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return psl.get(hostname);
}

const useStyles = makeStyles({
  avatar: {
    height: '50px',
    width: '50px',
    '@media (max-width: 650px)': {
      height: '40px',
      width: '40px'
    },
    '@media (max-width: 450px)': {
      height: '30px',
      width: '30px'
    }
  },
  upvote: {
    fill: 'green',
    '&:hover': {
      cursor: 'pointer'
    },
    '@media (max-width: 650px)': {
      fontSize: '1.3rem'
    },
    '@media (max-width: 450px)': {
      fontSize: '1.1rem'
    }
  },
  downvote: {
    fill: 'red',
    '&:hover': {
      cursor: 'pointer'
    },
    '@media (max-width: 650px)': {
      fontSize: '1.3rem'
    },
    '@media (max-width: 450px)': {
      fontSize: '1.1rem'
    }
  },
  commentIcon: {
    fontSize: '1rem',
    marginRight: '3px',
    '@media (max-width: 650px)': {
      fontSize: '0.9rem'
    },
    '@media (max-width: 450px)': {
      fontSize: '0.7rem'
    }
  },
  categoryIcon: {
    fontSize: '1rem',
    marginRight: '3px',
    '@media (max-width: 650px)': {
      fontSize: '0.9rem'
    },
    '@media (max-width: 450px)': {
      fontSize: '0.7rem'
    }
  },
  couponIcon: {
    margin: 0,
    padding: '2px 2px',
    fontSize: '1.2rem',
    '@media (max-width: 650px)': {
      fontSize: '0.9rem'
    },
    '@media (max-width: 450px)': {
      fontSize: '0.7rem'
    }
  },
  linkIcon: {
    fontSize: '100%',
    marginLeft: '5px'
  },
  dateRangeIcon: {
    fontSize: '1rem',
    marginRight: '3px',
    '@media (max-width: 650px)': {
      fontSize: '0.9rem'
    },
    '@media (max-width: 450px)': {
      fontSize: '0.7rem'
    }
  }
});

function PostItem({ post, detailed, handleVoteAction, handlePostDelete }) {
  const classes = useStyles();
  const modifier = detailed ? 'display-detailed' : '';

  const history = useHistory();
  const { isAuthenticated, user } = useAuth0();

  return (
    <div className={`post ${detailed ? `post--${modifier}` : ''}`}>
      <div className="post__meta">
        <Avatar className={classes.avatar} alt={post.author} src="https://files.ozbargain.com.au/gmask/38.jpg" />
        <div className="post__votes">
          <AddBoxTwoToneIcon 
            className={classes.upvote} 
            onClick={() => handleVoteAction && handleVoteAction(post.id, { type: 'increment' })} />
          <IndeterminateCheckBoxTwoToneIcon 
            className={classes.downvote} 
            onClick={() => handleVoteAction && handleVoteAction(post.id, { type: 'decrement' })} />
        </div>
        <div className='post__vote-count'>{post.votes} phiếu</div>
        {
          detailed && post.votes > 0 && 
            (
              <Link to={{pathname: `/posts/${post.id}/votes`}}>
                <div className="post__see-votes">Xem phiếu</div>
              </Link>
            ) 
        }
        
      </div>
      
      <div className="post__content">
        <div className='post__image-wrapper'>
          <img className="post__image" alt="" src={post.image_url?.length > 0 ? post.image_url : NoImage} />
        </div>
        {
          !detailed ? 
            (
              <Link to={{pathname: `/posts/${post.id}`}}>
                <h2 className={`post__title ${detailed ? `post__title--${modifier}` : ''}`}>{post.title}</h2>
              </Link>
            ) :
            (
              <h2 className={`post__title ${detailed ? `post__title--${modifier}` : ''}`}>{post.title}</h2>
            )
        }

        <div className="post__subheader">
          <Link to={{pathname: `/users/${post.author}`}}>
            <div className="post__author">{post.author}</div>
          </Link>
          <div>
            {
              isWithinAWeek(moment(post.created_time)) ? 
                moment(post.created_time).fromNow() :
                moment(post.created_time).format('DD/MM/YYYY HH:mm')
            }
          </div>
          { post.product_url?.length > 0 &&
            (
              <>
                <LinkIcon className={classes.linkIcon} />
                <a className="post__link" href={post.product_url}>{getDomainName(post.product_url)}</a>
              </>
            )
          }
        </div>

        { post.coupon_code?.length > 0 &&
          <div className={`post__coupon ${detailed ? `post__coupon--${modifier}` : ''}`}>
            <ShoppingCartIcon className={classes.couponIcon}/>
            <div className="post__coupon-code">{post.coupon_code}</div>
          </div>
        }

        <pre className={`post__description ${detailed ? `post__description--${modifier}` : ''}`}>
          {post.description}
        </pre>

        <div className="post__footer">
          { 
            !modifier.length && (
              <>
                <ChatBubbleIcon className={classes.commentIcon} />
                <div>{post.comment_count}</div>
              </>
            )
          }
          <LabelIcon className={classes.categoryIcon} />
          <div>{post.category}</div>
          <DateRangeIcon className={classes.dateRangeIcon}/>
          <div>
            {moment(post.start_date).format('DD/MM')} - {moment(post.end_date).format('DD/MM/YYYY')}
          </div>
          <ReportButton type="Post" post_id={post.id} />
          { 
            isAuthenticated && user[config.claimNamespace+'username'] === post.author && detailed && (
              <>
                <button className='post__personal-buttons' onClick={() => history.push(`/posts/${post.id}/edit`)}>sửa</button>
                <button className='post__personal-buttons' onClick={() => handlePostDelete(true)}>xóa</button>
              </>
          )}
        </div>
        
      </div>            
    </div>
  );
}

PostItem.defaultProps = {
  detailed: false
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  detailed: PropTypes.bool.isRequired, 
  handleVoteAction: PropTypes.func, 
  handleDelete: PropTypes.func
};

export default PostItem;
