import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useDataProvider } from '../../GlobalState';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import AddPostButton from '../AddPostButton/AddPostButton';
import logo from './logo192.png';
import config from '../../lib/config';
import './Header.css';

const useStyles = makeStyles({
  button: {
    color: 'white',
    height: '100%',
    width: '90px',
    fontSize: '13px',
    '&:hover': {
      backgroundColor: '#af5e0c',
    }
  },
  formControl: {
    fontSize: '13px',
    backgroundColor: 'white',
    height: '100%',
    minWidth: '200px'
  },
  select: {
    height: '100%',
    borderRadius: '0',
    backgroundColor: 'white'
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
    fontSize: '13px',
    height: '100%',
    borderRadius: '5px'
  }
});


function Header() {
  const classes = useStyles();
  const { isAuthenticated, loginWithPopup, logout, user } = useAuth0();
  const history = useHistory();
  const state = useDataProvider();
  const [ categories ] = state.categoryStore.data;

  // local state
  const [ selectedCategory, setSelectedCategory ] = useState('');
  const [ search, setSearch ] = useState('');

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

  return (
    <header className="header">
      <Link to="/">
        <img className="logo" alt="gia re logo" src={logo} />
      </Link>

      {isAuthenticated ? 
        (
          <>
            <AddPostButton />
            <Button 
              className={classes.button} 
              onClick={() => history.push(`/users/${user[config.claimNamespace+'username']}`)}>
                My Account
            </Button>
            <Button 
              className={classes.button} 
              color="primary" 
              onClick={() => logout({returnTo: window.location.origin})}>
              Log Out
            </Button>
          </>
        ) :
        <Button className={classes.button} color="primary" onClick={() => loginWithPopup()}>
          Log In
        </Button> }

      <form className="header__filter" onSubmit={handleSubmit}>
        <FormControl size="small" variant="filled" className={classes.formControl}>
          <InputLabel>Categories</InputLabel>
          <Select value={selectedCategory} onChange={handleCategory} label="Category" className={classes.select}>
            <MenuItem value="All">All</MenuItem>
            {categories.map((category, index) => 
              <MenuItem key={index} value={category}>{category}</MenuItem>)}
          </Select>
        </FormControl>
        <div className="search">
          <input type="text" value={search} placeholder="I'm looking for..." onChange={handleSearch} />
          <SearchIcon color="disabled" className={classes.searchIcon}/>
        </div>
        <Input 
          type='submit' 
          value='Update' 
          color='primary' 
          disableUnderline='true'
          className={classes.input} />
      </form>
      
    </header>
  );
}

export default Header;