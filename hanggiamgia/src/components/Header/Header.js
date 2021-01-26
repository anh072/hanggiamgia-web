import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useDataProvider } from '../../GlobalState';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import './Header.css';
import { Button } from '@material-ui/core';
import AddPostButton from '../AddPostButton/AddPostButton';
import logo from './logo192.png';

const useStyles = makeStyles({
  button: {
    color: 'black',
    height: '100%',
    width: '100px',
    fontSize: '13px',
    '&:hover': {
      backgroundColor: '#af5e0c',
    }
  },
  formControl: {
    fontSize: '13px',
    backgroundColor: 'white',
    height: '100%',
    display: 'inlineBlock',
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
  }
});


function Header() {
  const classes = useStyles();
  const { isAuthenticated, loginWithPopup, logout } = useAuth0();
  const history = useHistory();
  const state = useDataProvider();
  const [categories] = state.categoryStore;
  const [_, setCategory] = state.selectedCategory;

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log("Sending search request");
      history.push('/posts/search');
    }
  }

  const handleCategory = (e) => {
    setCategory(e.target.value);
  }

  return (
    <header className="header">
      <Link to="/">
        <img className="logo" alt="gia re logo" src={logo} />
      </Link>

      {isAuthenticated ? 
        (
          <>
            <AddPostButton />
            <Button className={classes.button} onClick={() => history.push("/profile")}>My Account</Button>
            <Button className={classes.button} color="primary" onClick={() => logout({returnTo: window.location.origin})}>
              Log Out
            </Button>
          </>
        ) :
        <Button className={classes.button} color="primary" onClick={() => loginWithPopup()}>
          Log In
        </Button> }

      <div className="header__filter">
        <FormControl size="small" variant="filled" className={classes.formControl}>
          <InputLabel>Categories</InputLabel>
          <Select onChange={handleCategory} label="Category" className={classes.select}>
            <MenuItem value="all">All</MenuItem>
            {categories.map((category, index) => 
              <MenuItem key={index} value={category}>{category}</MenuItem>)}
          </Select>
        </FormControl>
        <div className="search">
          <input type="text" placeholder="I'm looking for..." onKeyDown={handleSearch} />
          <SearchIcon color="disabled" className={classes.searchIcon}/>
        </div>
      </div>
      
    </header>
  );
}

export default Header;