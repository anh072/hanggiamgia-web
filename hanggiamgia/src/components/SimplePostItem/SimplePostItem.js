import React from 'react';
import PropTypes from 'prop-types';
import LabelIcon from '@material-ui/icons/Label';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import config from '../../lib/config';
import './SimplePostItem.css';

const useStyles = makeStyles({
  categoryIcon: {
    fontSize: '1rem',
    marginRight: '3px'
  },
  commentIcon: {
    fontSize: '1rem',
    marginRight: '3px'
  },
  voteIcon: {
    fontSize: '1rem',
    fill: 'white'
  }
});

function SimplePostItem({ post }) {
  const classes = useStyles();

  return (
    <div className='simple-post'>
      <div className='simple-post__content'>
        <Link to={{pathname: `/posts/${post.id}`}}>
          <h2 className='simple-post__title'>{post.title}</h2>
        </Link>
        <Link to={{pathname: `/users/${post.author}`}}>
          <div className="simple-post__author">{post.author}</div>
        </Link>
        <div className='simple-post__footer'>
          <div 
            className={`simple-post__votes 
              ${post.votes >= 0 ? 'simple-post__votes--positive' : 'simple-post__votes--negative'}`}>
            {post.votes > 0 ? '+' : post.votes < 0 ? '-' : ''}{post.votes}
          </div>
          <ChatBubbleIcon className={classes.commentIcon} />
          <div>{post.comment_count}</div>
          <div>{moment.tz(post.start_date, config.localTimezone).format('YYYY/MM/DD')}</div>
          <LabelIcon className={classes.categoryIcon} />
          <div>{post.category}</div>
        </div>
      </div>
      <img className="simple-post__image" alt="" src={post.image_url?.length > 0 ? post.image_url : '/images/no-image-available.png'} />
    </div>
  );
}

SimplePostItem.propTypes = {
  post: PropTypes.object.isRequired
}; 

export default SimplePostItem;
