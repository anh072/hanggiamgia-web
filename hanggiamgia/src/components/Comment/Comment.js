import React from 'react';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import ReportButton from '../ReportButton/ReportButton';
import './Comment.css';

const useStyles = makeStyles({
  avatar: {
    height: '35px',
    width: '35px',
  }
});

function Comment({ comment }) {
  const classes = useStyles();

  return (
    <div className="comment">
      <Avatar className={classes.avatar} alt={comment.author} src="https://files.ozbargain.com.au/gmask/38.jpg" />
      <div className="comment__block">
        <div className="comment__body">
          <div className="comment__header">
            <Link to={{pathname: `/users/${comment.author}`}}>
              <div className="comment__author">{comment.author}</div>
            </Link>
            <div className="comment__date">{moment.tz(comment.created_time, "Asia/Ho_Chi_Minh").format('YYYY/MM/DD HH:MM')}</div>
          </div>
          <pre>{comment.text}</pre>
        </div>
        <ReportButton type="Comment" comment_id={comment.id}/>
      </div>
    </div>
  );
}

export default Comment;
