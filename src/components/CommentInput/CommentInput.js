import React, { useState } from 'react';
import { Avatar, Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import './CommentInput.css';

const useStyles = makeStyles({
  avatar: {
    height: '35px',
    width: '35px',
    '@media (max-width: 450px)': {
      height: '30px',
      width: '30px'
    }
  },
  input: {
    width: '100%'
  },
  button: {
    marginTop: '10px',
    marginBottom: '10px'
  }
});


function CommentInput({ onSubmit, onChange }) {
  const classes = useStyles();

  const [text, setText] = useState('');
  const isScreenSmall = useMediaQuery({ query: `(max-width: 650px)` });

  const handleChange = (e) => {
    setText(e.target.value);
    onChange(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit();
    setText('');
  };

  return (
    <div className='comment-input'>
      <Avatar className={classes.avatar} src="https://files.ozbargain.com.au/gmask/38.jpg" />
      <form>
        <TextField
          id="standard-textarea"
          placeholder="Write a comment..."
          multiline
          rowsMax={100}
          variant="outlined"
          onChange={handleChange}
          value={text}
          className={classes.input}
          size={isScreenSmall ? 'small': 'medium'}
        />
        <Button 
          className={classes.button}
          variant='contained' 
          size='small' color='primary' 
          onClick={handleSubmit}>
            Submit
        </Button>
      </form>
    </div>
  );
}

CommentInput.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
};

export default CommentInput;
