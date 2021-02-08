import React, { useState } from 'react';
import { Backdrop, Modal, Button, TextareaAutosize, Select, MenuItem, FormControl, Fade } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useDataProvider } from '../../GlobalState';
import './ReportButton.css';

import config from '../../lib/config';

const useStyles = makeStyles({
  button: {
    margin: '20px 0px 20px 20px',
    '@media (max-width: 450px)': {
      margin: '10px 0px, 10px, 10px'
    }
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'scroll'
  },
  paper: {
    backgroundColor: 'white',
    border: '2px solid #000',
    padding: '0',
    position: 'absolute',
    margin: 'auto',
    maxWidth: '500px',
    fontSize: '1rem',
    '@media (max-width: 450px)': {
      fontSize: '0.8rem'
    }
  },
  textArea: {
    width: 'calc(100% - 40px)',
    padding: '5px',
    fontSize: '1rem',
    '@media (max-width: 450px)': {
      fontSize: '0.8rem'
    }
  }
});

const StyledSelect = withStyles({
  root: {
    backgroundColor: 'white',
    fontSize: '0.9rem',
    width: '180px',
    '@media (max-width: 650px)': {
      fontSize: '0.9rem',
      padding: '10px 0px'
    },
    '@media (max-width: 450px)': {
      fontSize: '0.7rem',
      padding: '5.5px 0px',
      width: '90px'
    }
  }
})(Select);

const StyledMenuItem = withStyles({
  root: {
    fontSize: '1rem',
    '@media (max-width: 650px)': {
      fontSize: '0.9rem',
      minHeight: '40px',
      padding: '6px 8px'
    },
    '@media (max-width: 450px)': {
      fontSize: '0.7rem',
      minHeight: '30px',
      padding: '3px 8px'
    }
  }
})(MenuItem);

const initialValues = {
  reason: '',
  description: ''
};

const validate = (values) => {
  let errors = {};
  if (!values.reason) {
    errors.reason = "Reason is required";
  }
  return errors;
};

function ReportButton({ type, post_id = null, comment_id = null }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const state = useDataProvider();
  const reasons = state.reasonStore.data;

  const apiBaseUrl = config.apiBaseUrl;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setValues(initialValues);
    setErrors({});
    setOpen(false);
  };

  const handleDescription = (e) => {
    setValues(prevState => ({
      ...prevState,
      description: e.target.value
    }));
  };

  const handleSelect = (e) => {
    setValues(prevState => ({
      ...prevState,
      reason: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = validate(values);
    if (Object.keys(errors).length !== 0) {
      setErrors(prevError => ({
        ...prevError,
        reason: errors.reason
      }));
      return;
    }
    setIsSubmitting(true);
    try {
      const data = {
        reason: values.reason,
        description: values.description
      };

      if (post_id !== null) data.post_id = post_id;
      if (comment_id !== null) data.comment_id = comment_id;

      const accessToken = await getAccessTokenSilently({ audience: config.auth0ApiAudience });
      console.log(accessToken);

      await axios.post(
        `${apiBaseUrl}/reports`, 
        data, 
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'username': user[config.claimNamespace+'username']
          } 
        },
        { timeout: 20000 }
      );
      setErrors({});
      setValues(initialValues);
      setIsSubmitting(false);
      setOpen(false);
    } catch (error) {
      console.log('error', error);
      setIsSubmitting(false);
      setErrors(prevError => ({
        ...prevError,
        submit: "Cannot submit form right now. Try again!"
      }));
    }
  };

  const renderForm = () => (
    <div className="report">
      <button onClick={handleOpen}>report</button>
      <Modal
        aria-labelledby="report-modal"
        aria-describedby="report-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <form className={classes.paper}>
            <h2 className="report__header">Report {type}</h2>
            <p className="report__fields">Report this item to help moderation team to identity items that require attention.</p>
            <br/>
            <div className="report__fields">
              <label>Reason: <span>&#42;</span></label> <br />
              <FormControl>
                <StyledSelect onChange={handleSelect} value={values.reason}>
                  {
                    reasons.map((reason, index) => <StyledMenuItem key={index} value={reason}>{reason}</StyledMenuItem>)
                  }
                </StyledSelect>
              </FormControl>
              { errors.reason && <p className="report__form-error">{errors.reason}</p> }
            </div>
            <br />
            <div className="report__fields">
              <label htmlFor="description">Description: (Optional)</label> <br />
              <TextareaAutosize
                id="description"
                name="description"
                className={classes.textArea}
                rowsMin={4}
                rowsMax={4}
                placeholder="Enter problem description..."
                onChange={handleDescription}
              />
            </div>
            <div className="report__submit-button">
              <Button 
                className={classes.button} 
                variant="contained" 
                color="primary" 
                onClick={handleSubmit}
                size='small'>
                  Submit
              </Button>
              <Button 
                className={classes.button} 
                variant="contained" 
                onClick={handleClose}
                size='small'>
                  Cancel
              </Button>
              { isSubmitting && (<p className='report__loading-message'>Creating the report...</p>) }
              { errors.submit && <p className="report__form-error report__submit-error">{errors.submit}</p> }
            </div>
          </form>
        </Fade>
      </Modal>
    </div>
  );

  return (
    <>
    {
      isAuthenticated && renderForm()
    }
    </>
  );
}

export default ReportButton;
