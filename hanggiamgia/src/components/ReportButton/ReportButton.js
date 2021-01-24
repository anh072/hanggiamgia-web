import { Backdrop, Modal, Button, TextareaAutosize, Select, MenuItem, FormControl, Fade } from '@material-ui/core';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDataProvider } from '../../GlobalState';
import './ReportButton.css';
import axios from 'axios';
import config from '../../lib/config';

const useStyles = makeStyles({
  button: {
    margin: '20px 0px 20px 20px',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: 'white',
    border: '2px solid #000',
    padding: '0',
    position: 'absolute',
    margin: 'auto',
    maxWidth: '500px',
    fontSize: '1rem'
  },
  textArea: {
    width: 'calc(100% - 40px)',
    padding: '5px'
  },
  select: {
    width: '180px'
  }
});

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

  const state = useDataProvider();
  const [reasons] = state.reasonApi.reasons;

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

    try {
      const data = {
        reason: values.reason,
        description: values.description
      };

      if (post_id !== null) data.post_id = post_id;
      if (comment_id !== null) data.comment_id = comment_id;

      await axios.post(
        `${apiBaseUrl}/reports`, 
        data, 
        { 
          headers: { 
            'Content-Type': 'application/json',
            'username': '' // TODO: testing purposses only
          } 
        }
      );
      setErrors({});
      setValues(initialValues);
      setOpen(false);
    } catch (error) {
      console.log('error', error);
      setErrors(prevError => ({
        ...prevError,
        submit: "Cannot submit form right now. Try again!"
      }));
    }
  };

  return (
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
          <form className={classes.paper }>
            <h2 className="report__header">Report {type}</h2>
            <p className="report__fields">Report this item to help moderation team to identity items that require attention.</p>
            <br/>
            <div className="report__fields">
              <label>Reason: <span>&#42;</span></label> <br />
              <FormControl>
                <Select className={classes.select} onChange={handleSelect} value={values.reason}>
                  {
                    reasons.map((reason, index) => <MenuItem key={index} value={reason}>{reason}</MenuItem>)
                  }
                </Select>
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
                onClick={handleSubmit}>
                  Submit
              </Button>
              <Button 
                className={classes.button} 
                variant="contained" 
                onClick={handleClose}>
                  Cancel
              </Button>
              { errors.submit && <p className="report__form-error report__submit-error">{errors.submit}</p> }
            </div>
          </form>
        </Fade>
      </Modal>
    </div>
  );
}

export default ReportButton;
