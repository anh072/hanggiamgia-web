import React, { useState } from 'react';
import { Avatar, TextField, Menu, MenuItem, Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import PropTypes from 'prop-types';
import ReportButton from '../ReportButton/ReportButton';
import config from '../../lib/config';
import './Comment.css';

const useStyles = makeStyles({
  avatar: {
    height: '35px',
    width: '35px',
    marginRight: '15px',
    '@media (max-width: 450px)': {
      height: '30px',
      width: '30px',
      marginRight: '10px'
    }
  },
  input: {
    width: '100%'
  },
  button: {
    marginTop: '10px',
    marginBottom: '10px',
    marginRight: '10px'
  }
});

function Comment({ comment, editable, onDelete, onUpdate }) {
  const classes = useStyles();
  const isScreenSmall = useMediaQuery({ query: `(max-width: 650px)` });

  const [ editing, setEditing ] = useState(false);
  const [ anchorEl, setAnchorEl ] = React.useState(null);
  const [ text, setText ] = useState(() => comment.text);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleUpdate = (e) => {
    onUpdate(comment.id, text);
    setEditing(false);
    setAnchorEl(null);
    setText(comment.text);
  };

  const handleCancel = (e) => {
    setText(comment.text);
    setEditing(false);
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete(comment.id);
    setAnchorEl(null);
  };

  const renderContent = () => {
    if (editing) {
      return (
        <form className='comment__editing-comment'>
          <TextField
            id="standard-textarea"
            multiline
            rowsMax={100}
            variant="outlined"
            onChange={handleChange}
            value={text}
            className={classes.input}
            size={isScreenSmall ? 'small' : 'medium'}
          />
          <div className='comment__buttons'>
            <Button 
              className={classes.button}
              variant='contained' 
              size='small' 
              color='primary' 
              onClick={handleUpdate}>
                Update
            </Button>
            <Button 
              className={classes.button}
              variant='contained' 
              size='small' 
              onClick={handleCancel}>
                Cancel
            </Button>
          </div>
        </form>
      );
    }
    return (
      <>
        <div className="comment__block">
          <div className='comment__main'>
            <div className="comment__body">
              <div className="comment__header">
                <Link to={{pathname: `/users/${comment.author}`}}>
                  <div className="comment__author">{comment.author}</div>
                </Link>
                <div className="comment__date">{moment.tz(comment.created_time, config.localTimezone).format('YYYY/MM/DD HH:MM')}</div>
              </div>
              <pre>{comment.text}</pre>
            </div>
            {
              editable && (
                <div className='comment__popper'>
                  <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => setEditing(true)}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  </Menu>
                </div>
              )
            }
          </div>
          <ReportButton type="Comment" comment_id={comment.id}/>

        </div>
      </>
    );
  };

  return (
    <div className="comment">
      <Avatar className={classes.avatar} alt={comment.author} src="https://files.ozbargain.com.au/gmask/38.jpg" />
      { renderContent() }
    </div>
  );
}

Comment.defaultProps = {
  editable: false,
  onDelete: () => {},
  onUpdate: () => {}
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  editable: PropTypes.bool.isRequired,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func
};

export default Comment;
