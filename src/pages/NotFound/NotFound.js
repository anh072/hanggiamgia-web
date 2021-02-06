import React from 'react';
import { Link } from 'react-router-dom';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import './NotFound.css';

const useStyles = makeStyles({
  sadIcon: {
    fontSize: '3rem',
    color: '#FAB81E'
  }
});

export default function NotFound() {
  const classes = useStyles();

  return (
    <div className='not-found'>
      <SentimentVeryDissatisfiedIcon className={classes.sadIcon} />
      <h2 className='not-found__title'>Ooups, page not found</h2>
      <p>It looks like you are trying to access a page that doesnt exists</p>
      <Link to='/'>
        <Button color='primary' variant='contained'>Back to Home</Button>
      </Link>
    </div>
  );
}
