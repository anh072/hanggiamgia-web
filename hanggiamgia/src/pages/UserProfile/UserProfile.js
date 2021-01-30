import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/styles';
import config from '../../lib/config';
import Tab from '../../components/Tab/Tab';
import TabItem from "../../components/Tab/TabItem";
import SimplePostItem from "../../components/SimplePostItem/SimplePostItem";
import Loading from "../../components/Loading/Loading";
import { calculatePages } from '../../lib/common';
import './UserProfile.css';


const useStyles = makeStyles({
  pagination: {
    margin: '20px auto',
    width: '33%'
  },
  paginationList: {
    justifyContent: 'center'
  }
});

function UserProfile() {
  const apiBaseUrl = config.apiBaseUrl;
  const classes = useStyles();

  const { username } = useParams();

  const [ userInfo, setUserInfo ] = useState({});
  const [ page, setPage ] = useState(1);
  const [ selectedTab, setSelectedTab ] = useState('Posts');
  const [ posts, setPosts ] = useState({});
  const [ errors, setErrors ] = useState({});
  const [ isLoadingPosts, setIsLoadingPosts ] = useState(false);
  const [ isLoadingUser, setIsLoadingUser ] = useState(false);

  useEffect(() => {
    const getPostsByUsername = async (username) => {
      try {
        setIsLoadingPosts(true);
        setPosts({});
        const res = await axios.get(
          `${apiBaseUrl}/users/${username}/posts?page=${page}`,
          { timeout: 20000 }
        );
        setPosts(res.data);
        setErrors(prevErrors => ({
          ...prevErrors,
          posts: ''
        }));
        setIsLoadingPosts(false);
      } catch(error) {
        console.error('error', error);
        setIsLoadingPosts(false);
        setErrors(prevErrors => ({
          ...prevErrors,
          posts: 'Error: Unable to get posts'
        }));
      }
    };

    const getCommentedPostsByUsername = async (username) => {
      try {
        setPosts({});
        setIsLoadingPosts(true);
        const res = await axios.get(
          `${apiBaseUrl}/users/${username}/commented_posts?page=${page}`,
          { timeout: 20000 }
        );
        setPosts(res.data);
        setErrors(prevErrors => ({
          ...prevErrors,
          comments: ''
        }));
        setIsLoadingPosts(false);
      } catch(error) {
        console.error('error', error);
        setIsLoadingPosts(false);
        setErrors(prevErrors => ({
          ...prevErrors,
          comments: 'Error: Unable to get posts commented by the user'
        }));
      }
    };

    if (selectedTab === 'Posts') getPostsByUsername(username);
    else getCommentedPostsByUsername(username);
  }, [page, username, selectedTab])

  useEffect(() => {
    const getUserByUsername = async (username) => {
      try {
        setIsLoadingUser(true);
        const res = await axios.get(
          `${apiBaseUrl}/users/${username}`,
          { timeout: 20000 }
        );
        setUserInfo(res.data.user);
        setIsLoadingUser(false);
        setErrors(prevErrors => ({
          ...prevErrors,
          user: ''
        }));
      } catch(error) {
        console.log('error', error);
        setErrors(prevErrors => ({
          ...prevErrors,
          user: 'Error: Unable to get user information'
        }));
        setIsLoadingUser(false);
      }
    };
    getUserByUsername(username);
  }, [username]);

  const handleSelectTab = (e, newValue) => {
    setSelectedTab(newValue);
  };

  const handlePageSelect = (e, page) => {
    setPage(page);
  };

  return (
    <div className='profile'>
      <h2>User Profile</h2>
      {
        isLoadingUser ? 
          <Loading size='medium' /> : (
            <div className='profile__details'>
              <div className='profile__avatar-container'>
                <img className='profile__avatar' src={userInfo.picture} alt={`${userInfo.username} avatar`} />
              </div>
              <table className='profile__userinfo'>
                <tbody>
                  <tr>
                    <td align='left' className='profile__label'>Username</td>
                    <td align='left'>{userInfo.username}</td>
                  </tr>
                  <tr>
                    <td align='left' className='profile__label'>Email</td>
                    <td align='left'>{userInfo.email}</td>
                  </tr>
                  <tr>
                    <td align='left' className='profile__label'>Member Since</td>
                    <td align='left'>{moment.tz(userInfo.created_time, config.localTimezone).format('YYYY/MM/DD')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
      }
      <Tab value={selectedTab} onChange={handleSelectTab}>
        <TabItem value="Posts" label="Posts" />
        <TabItem value="Comments" label="Commented On" />
      </Tab>
      <div className='profile__items'>
        {isLoadingPosts ?
          <Loading size='medium' /> : (
            <>
            {
              posts.posts && posts.posts.length > 0 && (
                posts.posts.map(post => <SimplePostItem post={post} key={post.id} />)
              )
            }
            { selectedTab === 'Posts' && errors.posts && (<p className='profile__error'>{errors.posts}</p>) }
            { selectedTab === 'Comments' && errors.comments && (<p className='profile__error'>{errors.comments}</p>) }
            </>
          )
        }
        <Pagination
          classes={{ul: classes.paginationList}}
          className={classes.pagination}
          count={calculatePages(posts.limit, posts.count)} 
          shape="rounded"
          variant="outlined"
          color="secondary"
          size="small"
          page={page}
          onChange={handlePageSelect}
        />
      </div>
    </div>
  );
};

export default UserProfile;