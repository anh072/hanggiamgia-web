import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useParams, useHistory } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Button, TextareaAutosize, Select, MenuItem, FormControl, TextField } from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';
import config from '../../lib/config';
import { useDataProvider } from '../../GlobalState';
import Loading from '../../components/Loading/Loading';
import NotFound from '../NotFound/NotFound';
import Forbidden from '../Forbidden/Forbidden';
import { validatePostForm } from '../../lib/common';
import '../NewDeal/NewDeal.css';

const useStyles = makeStyles({
  dateField: {
    width: '200px'
  },
  textField: {
    width: 'calc(100% - 40px)',
    boxSizing: 'border-box',
    '@media (max-width: 450px)': {
      width: '100%',
      fontSize: '0.5rem'
    }
  },
  inputField: {
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
      width: 'calc(100% - 20px)',
      fontSize: '0.8rem'
    }
  },
  select: {
    width: '200px'
  },
  submitButton: {
    margin: '10px 0px 10px 0px'
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

function EditPost() {
  const apiBaseUrl = config.apiBaseUrl;
  const state = useDataProvider();
  const categories = state.categoryStore.data;

  const classes = useStyles();

  const [ values, setValues ] = useState({});
  const [ errors, setErrors ] = useState({});
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);

  const { user, getAccessTokenSilently } = useAuth0();
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const getPostById = async (id) => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${apiBaseUrl}/posts/${id}`);
        const post = res.data;
        if (post.author !== user[config.claimNamespace+'username']) {
          setErrors(prevErrors => ({
            ...prevErrors,
            forbidden: 'Error: User has no permission to edit the post'
          }));
          setIsLoading(false);
          return;
        }
        setErrors(prevErrors => ({
          ...prevErrors,
          forbidden: '',
          notfound: '',
          post: ''
        }));
        setValues({
          category: post.category,
          coupon: post.coupon_code || '',
          title: post.title,
          url: post.product_url || '',
          start: moment.tz(post.start_date, config.localTimezone).format('YYYY-MM-DD'),
          end: moment.tz(post.end_date, config.localTimezone).format('YYYY-MM-DD'),
          image: '',
          description: post.description
        });
        setIsLoading(false);
      } catch(error) {
        console.log('error', error);
        if (error.response && error.response.status === 404) {
          setErrors(prevErrors => ({
            ...prevErrors,
            notfound: 'Error: Post is not found'
          }));
        } else {
          setErrors(prevErrors => ({
            ...prevErrors,
            post: 'Error: Unable to get post'
          }));
        }
        setIsLoading(false);
      }
    };
    getPostById(id);
  }, [id]);

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
        [name]: e.target.value
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

    let errors = validatePostForm(values);
    if (Object.keys(errors).length !== 0) {
      setErrors(prevErrors => ({
        ...prevErrors,
        errors
      }));
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
      const accessToken = await getAccessTokenSilently({ audience: config.auth0ApiAudience });
      if (values.image) {
        const res = await axios.post(
          `${apiBaseUrl}/users/${user[config.claimNamespace+'username']}/images/upload`,
          values.image,
          { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${accessToken}` } },
          { timeout: 20000 }
        );
        const imageUrl = res.data.image_url;
        data.image_url = imageUrl;
      }

      if (values.coupon.length > 0) data.coupon = values.coupon;
      if (values.url.length > 0) data.url = values.url;

      // create the actual post
      const res = await axios.put(
        `${apiBaseUrl}/posts/${id}`, 
        data, 
        { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` } },
        { timeout: 20000 }
      );
      const newPost = res.data;
      setValues({
        category: newPost.category,
        coupon: newPost.coupon_code || '',
        title: newPost.title,
        url: newPost.product_url || '',
        start: moment.tz(newPost.start_date, config.localTimezone).format('YYYY-MM-DD'),
        end: moment.tz(newPost.end_date, config.localTimezone).format('YYYY-MM-DD'),
        image: '',
        description: newPost.description
      });
      setIsSubmitting(false);
      history.push(`/posts/${id}`);
    } catch (error) {
      console.log('error', error);
      setIsSubmitting(false);
      setErrors(prevErrors => ({
        ...prevErrors,
        submit: "Unable to update the post. Try again!"
      }));
    }
  };

  const renderForm = () => (
    <form className='deal'>
      <h2 className="deal__header">Update Post</h2>
      <div className="deal__fields">
        <label htmlFor="title">Title <span>&#42;</span></label> <br />
        <TextField 
          id="title" 
          name="title" 
          required 
          value={values.title}
          onChange={handleChange} 
          className={classes.textField}
          InputProps={{
            classes: {
              input: classes.inputField
            }
          }}
        />
        { errors.title && <p className="deal__form-error">{errors.title}</p> }
      </div>

      <div className="deal__fields">
        <label htmlFor="url">Link</label> <br />
        <TextField 
          id="url"
          name="url"
          placeholder="Link to the product e.g https://ebay.com.au"
          value={values.url}
          onChange={handleChange} 
          className={classes.textField}
          InputProps={{
            classes: {
              input: classes.inputField
            }
          }}
        />
        { errors.url && <p className="deal__form-error">{errors.url}</p> }
      </div>

      <div className="deal__fields">
        <label htmlFor="image">Image</label> <br />
        <TextField 
          id="image"
          name="image"
          type="file" 
          value={values.image}
          onChange={handleChange} 
          className={classes.textField}
          InputProps={{
            classes: {
              input: classes.inputField
            }
          }}
        />
        { errors.image && <p className="deal__form-error">{errors.image}</p> }
      </div>

      <div className="deal__fields">
        <label htmlFor="coupon">Coupon Code</label> <br />
        <TextField 
          id="coupon"
          name="coupon"
          placeholder="Enter coupon..."
          value={values.coupon}
          onChange={handleChange} 
          className={classes.textField}
          InputProps={{
            classes: {
              input: classes.inputField
            }
          }}
        />
      </div>

      <div className="deal__fields">
        <label htmlFor="start">Start <span>&#42;</span></label> <br />
        <TextField
          id="start"
          name="start"
          value={values.start}
          required
          type="date"
          className={classes.dateField}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleChange}
          InputProps={{
            classes: {
              input: classes.inputField
            }
          }}
        />
        { errors.start && <p className="deal__form-error">{errors.start}</p> }
      </div>
      
      <div className="deal__fields">
        <label htmlFor="expiry">Expiry <span>&#42;</span></label> <br />
        <TextField
          id="expiry"
          name="end"
          value={values.end}
          required
          type="date"
          className={classes.dateField}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleChange}
          InputProps={{
            classes: {
              input: classes.inputField
            }
          }}
        />
        { errors.end && <p className="deal__form-error">{errors.end}</p> }
      </div>
      
      <div className="deal__fields">
        <label>Categories <span>&#42;</span></label> <br />
        <FormControl>
          <StyledSelect 
            value={values.category}
            onChange={handleSelect}>
            {
              categories.map((category, index) => 
                <StyledMenuItem dense key={index} value={category}>{category}</StyledMenuItem>)
            }
          </StyledSelect>
        </FormControl>
        { errors.category && <p className="deal__form-error">{errors.category}</p> }
      </div>
      
      <div className="deal__fields">
        <label htmlFor="description">Description <span>&#42;</span></label> <br />
        <TextareaAutosize
          id="description"
          name="description"
          value={values.description}
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
          onClick={handleSubmit}
          size='small'>
            Update
        </Button>
        { isSubmitting && (<p className='deal__loading-message'>Updating the post ...</p>) }
        { errors.submit && <p className="deal__form-error deal__submit-error">{errors.submit}</p> }
      </div>
    </form>
  );

  if (isLoading) {
    return <Loading size='large' />;
  } 
  
  if (errors.notfound) {
    return <NotFound />;
  }
  
  if (errors.forbidden) {
    return <Forbidden />;
  } 
  
  if (errors.post) {
    return <p className="deal__form-error" style={{padding: '20px'}}>{errors.post}</p>;
  }

  return (
    <div>
      { renderForm() }
    </div>
  );
}

export default EditPost;
