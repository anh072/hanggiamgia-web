import React from 'react';
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
import { useAuth0 } from '@auth0/auth0-react';
import psl from 'psl';
import ReportButton from '../ReportButton/ReportButton';
import axios from 'axios';
import config from '../../lib/config';
import { useDataProvider } from '../../GlobalState';
import './PostItem.css';


const useStyles = makeStyles({
  avatar: {
    height: '50px',
    width: '50px',
  },
  upvote: {
    fill: 'green',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  downvote: {
    fill: 'red',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  commentIcon: {
    fontSize: '1rem',
    marginRight: '3px'
  },
  categoryIcon: {
    fontSize: '1rem',
    marginRight: '3px'
  },
  couponIcon: {
    margin: 0,
    padding: '2px 2px',
    borderRight: '1px solid black'
  },
  linkIcon: {
    fontSize: '100%',
    marginLeft: '5px'
  },
  dateRangeIcon: {
    fontSize: '1rem'
  }
});

export default function PostItem({ post, detailed=false }) {
  const classes = useStyles();
  const modifier = detailed ? 'display-detailed' : '';

  const apiBaseUrl = config.apiBaseUrl;

  const { isAuthenticated } = useAuth0();
  const state = useDataProvider();
  const [ posts, setPosts ] = state.postApi.posts;

  const handleUpVote = async () => {
    if (!isAuthenticated) alert("You must be logged in to vote");
    try {
      await axios.put(
        `${apiBaseUrl}/posts/${post.id}/votes`, 
        { vote_action: 'increment' }, 
        { 
          headers: { 
            'Content-Type': 'application/json',
            'username': 'testvotes2' // TODO: remove this
          } 
        }
      );
      const currentPostIndex = posts.findIndex(p => p.id === post.id);
      posts[currentPostIndex].votes++;
      setPosts([...posts]);
    } catch (error) {
      console.log('error', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Unexpected error has occured");
      }
    }
  }

  const handleDownVote = async () => {
    if (!isAuthenticated) alert("You must be logged in to vote");
    try {
      await axios.put(
        `${apiBaseUrl}/posts/${post.id}/votes`, 
        { vote_action: 'decrement' }, 
        { 
          headers: { 
            'Content-Type': 'application/json',
            'username': 'testDownVote2' // TODO: remove this
          } 
        }
      );
      const currentPostIndex = posts.findIndex(p => p.id === post.id);
      posts[currentPostIndex].votes--;
      setPosts([...posts]);
    } catch (error) {
      console.log('error', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Unexpected error has occured");
      }
    }
  }

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

  return (
    <div className={`post ${detailed ? `post--${modifier}` : ''}`}>
      <div className="post__meta">
        <Avatar className={classes.avatar} alt={post.author} src="https://files.ozbargain.com.au/gmask/38.jpg" />
        <div className="post__votes">
          <AddBoxTwoToneIcon className={classes.upvote} onClick={handleUpVote} />
          <IndeterminateCheckBoxTwoToneIcon className={classes.downvote} onClick={handleDownVote} />
        </div>
        <div>{post.votes} votes</div>
        {
          detailed && isAuthenticated && 
            (
              <Link to={{pathname: `/posts/${post.id}/votes`}}>
                <div className="post__see-votes">See votes</div>
              </Link>
            ) 
        }
        
      </div>
      
      <div className="post__content">
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
          <div>{moment(post.created_time).format('DD/MM/YYYY - hh:mm')}</div>
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

        <p className={`post__description ${detailed ? `post__description--${modifier}` : ''}`}>
          {post.description}
        </p>

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
            {moment.tz(post.start_date, 'Asia/Ho_Chi_Minh').format('YYYY/MM/DD HH:MM')} - {moment.tz(post.end_date, 'Asia/Ho_Chi_Minh').format('YYYY/MM/DD HH:MM')}
          </div>
          <ReportButton type="Post" post_id={post.id} />
        </div>
        
      </div>
      
      <img className="post__image" alt="" src={post.image_url?.length > 0 ? post.image_url : '/images/no-image-available.png'} />
    </div>
  );
}
