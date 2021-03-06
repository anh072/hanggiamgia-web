import React, { useState } from 'react';
import { Backdrop, Modal, Button, TextareaAutosize, Select, MenuItem, FormControl, Fade } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
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
    resize: 'none',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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
    errors.reason = "Lý do là bắt buộc";
  }
  return errors;
};

function ReportButton({ type, post_id, comment_id }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

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
            'Authorization': `Bearer ${accessToken}`
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
        submit: "Lỗi: Không gửi được báo cáo. Thử lại!"
      }));
    }
  };

  const renderForm = () => (
    <div className="report">
      <button onClick={handleOpen}>báo cáo</button>
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
            <h2 className="report__header">Báo cáo {type === 'Post' ? 'bài' : 'bình luận' }</h2>
            <p className="report__fields">Báo cáo để admin xử lý bài viết có nội dung không phù hợp</p>
            <br/>
            <div className="report__fields">
              <label>Lý do: <span>&#42;</span></label> <br />
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
              <label htmlFor="description">Mô tả: (Tùy ý)</label> <br />
              <TextareaAutosize
                id="description"
                name="description"
                className={classes.textArea}
                rowsMin={4}
                rowsMax={4}
                placeholder="Điền mô tả của bạn..."
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
                  Gửi
              </Button>
              <Button 
                className={classes.button} 
                variant="contained" 
                onClick={handleClose}
                size='small'>
                  Hủy
              </Button>
              { isSubmitting && (<p className='report__loading-message'>Đang gửi báo cáo...</p>) }
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

ReportButton.defaultProps = {
  post_id: null,
  comment_id: null
};

ReportButton.propTypes = {
  type: PropTypes.oneOf(['Post', 'Comment']),
  post_id: PropTypes.number,
  comment_id: PropTypes.number
};

export default ReportButton;
