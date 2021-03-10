import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/styles';
import { useAuth0 } from '@auth0/auth0-react';
import PropTypes from 'prop-types';
import config from '../../lib/config';
import Tab from '../../components/Tab/Tab';
import TabItem from "../../components/Tab/TabItem";
import SimplePostItem from "../../components/SimplePostItem/SimplePostItem";
import Loading from "../../components/Loading/Loading";
import { calculatePages } from '../../lib/common';
import NotFound from '../NotFound/NotFound';
import InternalError from '../../pages/InternalError/InternalError';
import { restClient } from "../../client";
import MetaDecorator from '../../components/MetaDecorator/MetaDecorator';
import './UserProfile.css';


const useStyles = makeStyles({
  pagination: {
    margin: '20px auto',
    width: '33%',
    '@media (max-width: 650px)': {
      width: '75%'
    }
  },
  paginationList: {
    justifyContent: 'center'
  }
});

function UserProfile({ staticContext }) {
  const classes = useStyles();

  const { username } = useParams();
  const { isAuthenticated, user } = useAuth0();

  const [ state, setState ] = useState(() => {
    if (staticContext && staticContext.data) {
      return {
        posts: staticContext.data.posts,
        userInfo: staticContext.data.user,
      };
    } 

    if (typeof window !== 'undefined' && window.__INITIAL_DATA__) {
      const initialData = window.__INITIAL_DATA__;
      delete window.__INITIAL_DATA__;
      return {
        posts: initialData.posts,
        userInfo: initialData.user,
      };
    }
    return {};
  });

  const [ page, setPage ] = useState(1);
  const [ selectedTab, setSelectedTab ] = useState('Posts');
  const [ errors, setErrors ] = useState({});
  const [ isLoadingPosts, setIsLoadingPosts ] = useState(false);
  const [ isLoadingUser, setIsLoadingUser ] = useState(false);

  useEffect(() => {
    const getUserByUsername = async (username) => {
      try {
        setIsLoadingUser(true);
        const res = await restClient.get(`/users/${username}`);
        setState(prevState => ({
          ...prevState,
          userInfo: res.data.user
        }));
        setIsLoadingUser(false);
        setErrors(prevErrors => ({
          ...prevErrors,
          user: ''
        }));
      } catch(error) {
        console.log('error', error);
        if (error.response && error.response.status === 404) {
          setErrors(prevErrors => ({
            ...prevErrors,
            notfound: 'Lỗi: Người dùng không tồn tại'
          }));
        } else {
          setErrors(prevErrors => ({
            ...prevErrors,
            user: 'Lỗi: Không thể tải thông tin người dùng'
          }));
        }
        setIsLoadingUser(false);
      }
    };
    if (!state.userInfo) getUserByUsername(username);
  }, [state.userInfo, username]);
  
  useEffect(() => {
    const getPostsByUsername = async (username) => {
      try {
        setIsLoadingPosts(true);
        setState(prevState => ({
          ...prevState,
          posts: {}
        }));
        const res = await restClient.get(`/users/${username}/posts?page=${page}`);
        setState(prevState => ({
          ...prevState,
          posts: res.data
        }));
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
          posts: 'Lỗi: Không thể tải bài viết'
        }));
      }
    };

    const getCommentedPostsByUsername = async (username) => {
      try {
        setState(prevState => ({
          ...prevState,
          posts: {}
        }));
        setIsLoadingPosts(true);
        const res = await restClient.get(`/users/${username}/commented_posts?page=${page}`);
        setState(prevState => ({
          ...prevState,
          posts: res.data
        }));
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
          comments: 'Lỗi: Không thể tải bài viết'
        }));
      }
    };

    if (selectedTab === 'Posts') getPostsByUsername(username);
    else getCommentedPostsByUsername(username);
  }, [page, username, selectedTab])

  const handleSelectTab = (e, newValue) => {
    setSelectedTab(newValue);
  };

  const handlePageSelect = (e, page) => {
    setPage(page);
  };

  if (errors && errors.notfound) return <NotFound />;

  if (errors && errors.user) return <InternalError/>;

  const renderUserInfo = () => {
    if (!state.userInfo) return null;
    return (
      <div className='profile__details'>
        <MetaDecorator 
          title={`Giá Rẻ Việt Nam - ${username}`} 
          description={`Hồ sơ của ${username}`}
          imageUrl={state.userInfo.picture}
          pageUrl={`/users/${username}`}
        />
        <div className='profile__avatar-container'>
          <img className='profile__avatar' src={state.userInfo.picture} alt={`${state.userInfo.username} avatar`} />
        </div>
        <table className='profile__userinfo'>
          <tbody>
            <tr>
              <td align='left' className='profile__label'>Tên tài khoản</td>
              <td align='left'>{state.userInfo.username}</td>
            </tr>
            {
              isAuthenticated && user[config.claimNamespace+'username'] === state.userInfo.username && (
                <tr>
                  <td align='left' className='profile__label'>Email</td>
                  <td align='left'>{state.userInfo.email}</td>
              </tr>
              )
            }
            <tr>
              <td align='left' className='profile__label'>Ngày đăng ký</td>
              <td align='left'>{moment(state.userInfo.created_time).format('YYYY/MM/DD')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderPosts = () => {
    if (!state.posts) return null;
    return (
      <>
      {
        state.posts.posts.length > 0 && (
          state.posts.posts.map(post => <SimplePostItem post={post} key={post.id} />)
        )
      }
      </>
    );
  };

  return (
    <div className='profile'>
      <h2 className='profile__title'>Thông tin người dùng</h2>
      {
        isLoadingUser ? 
          <Loading size='medium' /> : renderUserInfo()
      }
      <Tab value={selectedTab} onChange={handleSelectTab}>
        <TabItem value="Posts" label="Bài viết" />
        <TabItem value="Comments" label="Bình luận" />
      </Tab>
      <div className='profile__items'>
        {isLoadingPosts ?
          <Loading size='medium' /> : (
            <>
            { renderPosts() }
            { selectedTab === 'Posts' && errors.posts && (<p className='profile__error'>{errors.posts}</p>) }
            { selectedTab === 'Comments' && errors.comments && (<p className='profile__error'>{errors.comments}</p>) }
            </>
          )
        }
        {
          state && state.posts && (
            <Pagination
              classes={{ul: classes.paginationList}}
              className={classes.pagination}
              count={calculatePages(state.posts.limit, state.posts.count)} 
              shape="rounded"
              variant="outlined"
              color="secondary"
              size="small"
              page={page}
              onChange={handlePageSelect}
            />
          )
        }
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  staticContext: PropTypes.object
};

UserProfile.fetchData = async (request) => {
  const path = request.path;
  const username = path.split('/').slice(-1)[0];
  let data;
  let err;
  try {
    const userResponse = await restClient.get(`/users/${username}`);
    const postsResponse = await restClient.get(`/users/${username}/posts`);
    data = {
      posts: postsResponse.data,
      user: userResponse.data.user
    };
  } catch (error) {
    err = error;
  }

  return {
    data: data,
    error: err
  };
};

export default UserProfile;