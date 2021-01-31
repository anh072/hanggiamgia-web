import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import './AddPostButton.css';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, Modal, Button, TextareaAutosize, Select, MenuItem, FormControl, Fade, TextField } from '@material-ui/core';
import axios from 'axios';
import { useDataProvider } from '../../GlobalState';
import config from '../../lib/config';


const useStyles = makeStyles({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateField: {
    width: '200px'
  },
  textField: {
    width: 'calc(100% - 40px)',
    boxSizing: 'border-box'
  },
  paper: {
    backgroundColor: 'white',
    border: '1px solid #000',
    padding: '0',
    position: 'absolute',
    margin: '0',
    width: '50%',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  textArea: {
    width: 'calc(100% - 40px)',
    padding: '5px'
  },
  select: {
    width: '200px'
  },
  submitButton: {
    margin: '10px 0px 20px 0px'
  },
  cancelButton: {
    display: 'inline-block',
    margin: '10px 0px 20px 20px'
  },
  createButton: {
    height: '100%',
    width: '90px',
    fontSize: '13px',
    color: 'white'
  }
});

const initialValues = {
  category: '',
  coupon: '',
  title: '',
  url: '',
  start: '',
  end: '',
  image: null,
  description: ''
};

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

function validImageType(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
  return validTypes.includes(file.type);
}

const validate = (values) => {
  let errors = {};
  if (!values.title.trim()) errors.title = "Title is required";
  if (!values.category) errors.category = "Category is required";
  if (!values.start) errors.start = "Start date is required";
  if (!values.end) errors.end = "Expiry date is required";
  var startDate = Date.parse(values.start);
  var endDate = Date.parse(values.end);
  if (startDate > endDate) errors.start = "Start date must be before expiry date";
  if (values.url.length > 0 && !validURL(values.url.trim())) errors.url = "Invalid link format";
  if (values.image && !validImageType(values.image)) errors.image = "Image must be jpeg, png or jpg";
  if (values.description.length < 20) errors.description = "Description must be at least 20 characters";
  return errors;
};

function AddPostButton() {
  const classes = useStyles();
  const [ open, setOpen ] = useState(false);
  const [ values, setValues ] = useState(initialValues);
  const [ errors, setErrors ] = useState({});
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const { user } = useAuth0();

  const state = useDataProvider();
  const categories = state.categoryStore.data;

  const apiBaseUrl = config.apiBaseUrl;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setValues(initialValues);
    setErrors({});
    setOpen(false);
  };

  const handleSelect = (e) => {
    setValues(prevValues => ({
      ...prevValues,
      category: e.target.value
    }));
  };

  const handleChange = (e) => {
    const { name } = e.target;
    
    if (name !== 'image') {
      setValues(prevValues => ({
        ...prevValues,
        [name]: e.target.value.trim()
      }));
    } else {
      setValues(prevValues => ({
        ...prevValues,
        [name]: e.target.files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = validate(values);
    if (Object.keys(errors).length !== 0) {
      setErrors(errors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      let data = {
        title: values.title,
        description: values.description,
        start_date: values.start,
        end_date: values.end,
        category: values.category
      };

      // upload image
      if (values.image) {
        const res = await axios.post(
          `${apiBaseUrl}/users/${user[config.claimNamespace+'username']}/images/upload`,
          values.image,
          { headers: { 'Content-Type': 'multipart/form-data', 'username': 'gmanshop' } }, //TODO: remove this
          { timeout: 20000 }
        );
        const imageUrl = res.data.image_url;
        data.image_url = imageUrl;
      }

      if (values.coupon.length > 0) data.coupon = values.coupon;
      if (values.url.length > 0) data.url = values.url;

      // create the actual post
      await axios.post(
        `${apiBaseUrl}/posts`, 
        data, 
        { headers: { 'Content-Type': 'application/json', 'username': 'gmanshop' } }, //TODO: remove this
        { timeout: 20000 }
      );
      setValues(initialValues);
      setIsSubmitting(false);
      setOpen(false);
    } catch (error) {
      console.log('error', error);
      setIsSubmitting(false);
      setErrors(prevErrors => ({
        ...prevErrors,
        submit: "Unable to create a new deal. Try again!"
      }));
    }
  };

  return (
    <div className="deal">
      <Button className={classes.createButton} onClick={handleOpen}>Add Deal</Button>
      <Modal
        aria-labelledby="deal-modal"
        aria-describedby="deal-modal-description"
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
            <h2 className="deal__header">Submit Deal</h2>

            <div className="deal__fields">
              <label htmlFor="title">Title <span>&#42;</span></label> <br />
              <TextField 
                id="title" 
                name="title" 
                required 
                onChange={handleChange} 
                className={classes.textField}/>
              { errors.title && <p className="deal__form-error">{errors.title}</p> }
            </div>

            <div className="deal__fields">
              <label htmlFor="url">Link</label> <br />
              <TextField 
                id="url"
                name="url"
                placeholder="Link to the product e.g https://ebay.com.au" 
                onChange={handleChange} 
                className={classes.textField}/>
              { errors.url && <p className="deal__form-error">{errors.url}</p> }
            </div>

            <div className="deal__fields">
              <label htmlFor="image">Image</label> <br />
              <TextField 
                id="image"
                name="image"
                type="file" 
                onChange={handleChange} 
                className={classes.textField}/>
              { errors.image && <p className="deal__form-error">{errors.image}</p> }
            </div>

            <div className="deal__fields">
              <label htmlFor="coupon">Coupon Code</label> <br />
              <TextField 
                id="coupon"
                name="coupon"
                placeholder="Enter coupon..." 
                onChange={handleChange} 
                className={classes.textField}/>
            </div>

            <div className="deal__fields">
              <label htmlFor="start">Start <span>&#42;</span></label> <br />
              <TextField
                id="start"
                name="start"
                required
                type="datetime-local"
                className={classes.dateField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange}
              />
              { errors.start && <p className="deal__form-error">{errors.start}</p> }
            </div>
            
            <div className="deal__fields">
              <label htmlFor="expiry">Expiry <span>&#42;</span></label> <br />
              <TextField
                id="expiry"
                name="end"
                required
                type="datetime-local"
                className={classes.dateField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange}
              />
              { errors.end && <p className="deal__form-error">{errors.end}</p> }
            </div>
            
            <div className="deal__fields">
              <label>Categories <span>&#42;</span></label> <br />
              <FormControl>
                <Select 
                  value={values.category}
                  className={classes.select} 
                  onChange={handleSelect}>
                  {
                    categories.map((category, index) => <MenuItem dense key={index} value={category}>{category}</MenuItem>)
                  }
                </Select>
              </FormControl>
              { errors.category && <p className="deal__form-error">{errors.category}</p> }
            </div>
            
            <div className="deal__fields">
              <label htmlFor="description">Description <span>&#42;</span></label> <br />
              <TextareaAutosize
                id="description"
                name="description"
                className={classes.textArea}
                rowsMin={6}
                rowsMax={6}
                placeholder="Enter your deal description..."
                onChange={handleChange}
              />
              { errors.description && <p className="deal__form-error">{errors.description}</p> }
            </div>
            <div className="deal__submit-button">
              <Button 
                className={classes.submitButton} 
                variant="contained" 
                color="primary" 
                onClick={handleSubmit}>
                  Submit
              </Button>
              <Button 
                  className={classes.cancelButton} 
                  variant="contained" 
                  onClick={handleClose}>
                    Cancel
              </Button>
              { isSubmitting && (<p className='deal__loading-message'>Creating a new post ...</p>) }
              { errors.submit && <p className="deal__form-error deal__submit-error">{errors.submit}</p> }
            </div>
          </form>
        </Fade>
      </Modal>
    </div>
  );
}

export default AddPostButton;
