import React, { useState } from 'react';
import { Avatar, Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './CommentInput.css';

const useStyles = makeStyles({
  avatar: {
    height: '35px',
    width: '35px',
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

  const handleChange = (e) => {
    setText(e.target.value);
    onChange(e.target.value);
  };

  const handleClick = () => {
    onSubmit();
    setText('');
  };

  return (
    <div className='comment-input'>
      <Avatar className={classes.avatar} src="https://files.ozbargain.com.au/gmask/38.jpg" />
      <div className='comment-input__form'>
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
          />
          <Button 
            className={classes.button}
            variant='contained' 
            size='small' color='primary' 
            onClick={handleClick}>
              Submit
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CommentInput
