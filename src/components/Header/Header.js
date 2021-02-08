import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useMediaQuery } from 'react-responsive';
import { Button } from '@material-ui/core';
import { useDataProvider } from '../../GlobalState';
import logo from './logo192.png';
import config from '../../lib/config';
import './Header.css';

const useStyles = makeStyles({
  button: {
    color: 'white',
    width: '90px',
    fontSize: '13px',
    '&:hover': {
      backgroundColor: '#af5e0c',
    },
    '@media (max-width: 950px)': {
      width: '100%'
    },
    '@media (max-width: 450px)': {
      fontSize: '0.6rem'
    }
  },
  formControl: {
    backgroundColor: 'white',
    width: '200px',
    '@media (max-width: 650px)': {
      width: '150px',
    },
    '@media (max-width: 450px)': {
      width: '100px',
    }
  },
  searchIcon: {
    textAlign: 'center',
    verticalAlign: 'middle',
    padding: '3px'
  },
  input: {
    color: 'white',
    backgroundColor: '#1976d2',
    padding: '6px 8px',
    fontSize: '0.9rem',
    borderRadius: '5px',
    '@media (max-width: 650px)': {
      fontSize: '0.9rem',
      padding: '2px 4px'
    },
    '@media (max-width: 450px)': {
      fontSize: '0.7rem',
      padding: '2px 4px'
    }
  }
});

const StyledSelect = withStyles({
  root: {
    backgroundColor: 'white',
    fontSize: '0.9rem',
    paddingTop: '27px',
    paddingBottom: '10px',
    '@media (max-width: 650px)': {
      fontSize: '0.9rem',
      padding: '10px 10px'
    },
    '@media (max-width: 450px)': {
      fontSize: '0.7rem',
      padding: '5.5px 10px'
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

function Header() {
  const classes = useStyles();
  const { isAuthenticated, loginWithPopup, logout, user } = useAuth0();
  const history = useHistory();
  const state = useDataProvider();
  const categories = state.categoryStore.data;
  const shouldDisplayCategoryLabel = useMediaQuery({ query: `(max-width: 650px)` });

  // local state
  const [ selectedCategory, setSelectedCategory ] = useState('All');
  const [ search, setSearch ] = useState('');
  const [ openBurger, setOpenBurger ] = useState(false);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  }

  const handleCategory = (e) => {
    setSelectedCategory(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.length > 0 || selectedCategory.length > 0) {
      let queryString = `?page=1&term=${search}&category=${selectedCategory}`;
      setSearch('');
      setSelectedCategory('');
      history.push({
        pathname: '/posts/search',
        search: queryString
      });
    }
  };

  const handleOpenBurger = () => {
    console.log('burger is clicked');
    setOpenBurger(prev => !prev);
  };

  return (
    <header className="header">
      <Link to="/">
        <img className="logo" alt="gia re logo" src={logo} />
      </Link>
      
      <div className={`header-nav ${openBurger ? 'header-nav--active' : ''}`}>
        {isAuthenticated ? 
          (
            <>
              <Button 
                className={classes.button}
                onClick={() => history.push('/posts/submit')}>
                Tạo Bài
              </Button>
              <Button 
                className={classes.button} 
                onClick={() => history.push(`/users/${user[config.claimNamespace+'username']}`)}>
                  Tài Khoản
              </Button>
              <Button 
                className={classes.button} 
                color="primary" 
                onClick={() => logout({returnTo: window.location.origin})}>
                Đăng Xuất
              </Button>
            </>
          ) :
          <Button className={classes.button} color="primary" onClick={() => loginWithPopup()}>
            Đăng Nhập
          </Button> }

        <form className="header__filter" onSubmit={handleSubmit}>
          <FormControl size="small" variant="filled" className={classes.formControl}>
            <InputLabel style={{display: shouldDisplayCategoryLabel ? 'none' : 'block'}}>Hạng mục</InputLabel>
            <StyledSelect value={selectedCategory} onChange={handleCategory} label="Category">
              <StyledMenuItem value="All">Tất cả</StyledMenuItem>
              {categories.map((category, index) => 
                <StyledMenuItem key={index} value={category}>{category}</StyledMenuItem>)}
            </StyledSelect>
          </FormControl>
          <div className="search">
            <input type="text" value={search} placeholder="Tìm kiếm..." onChange={handleSearch} />
            <SearchIcon color="disabled" className={classes.searchIcon}/>
          </div>
          <Input 
            type='submit' 
            value='Tìm kiếm' 
            color='primary' 
            disableUnderline={true}
            className={classes.input} />
        </form>
      </div>
      
      <div 
        className='header-burger' onClick={handleOpenBurger}>
        <div 
          className={`header-burger__line-one ${openBurger ? 'header-burger__line-one--active' : ''} header-burger__layer`}>
        </div>
        <div className={`header-burger__line-two ${openBurger ? 'header-burger__line-two--active' : ''} header-burger__layer`}>
        </div>
        <div className={`header-burger__line-three ${openBurger ? 'header-burger__line-three--active' : ''} header-burger__layer`}>
        </div>
      </div>
      
    </header>
  );
}

export default Header;