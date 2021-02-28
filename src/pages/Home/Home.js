import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import Loading from '../../components/Loading/Loading';
import PostItem from '../../components/PostItem/PostItem';
import config from '../../lib/config';
import { calculatePages, useQuery } from '../../lib/common';
import { restClient } from '../../client/index';
import './Home.css';


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

export default function Home({ staticContext }) {
  const classes = useStyles();
  const query = useQuery();
  const page = isNaN(query.get('page')) || !query.get('page') ? 1 : parseInt(query.get('page'));
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const history = useHistory();

  const [ posts, setPosts ] = useState(() => {
    if (staticContext && staticContext.data) {
      return staticContext.data;
    } 
    if (typeof window !== 'undefined' && window.__INITIAL_DATA__) {
      const initialData = window.__INITIAL_DATA__;
      delete window.__INITIAL_DATA__;
      return initialData;
    }
    return null;
  });
  const [ isLoading, setIsLoading ] = useState(false);
  const [ errors, setErrors ] = useState({});

  useEffect(() => {
    const getPosts = async () => {
      try {
        setIsLoading(true);
        const res = await restClient.get(`/posts?page=${page}`);
        setPosts(res.data);
        setIsLoading(false);
        setErrors(prevErrors => ({
          ...prevErrors,
          posts: ''
        }));
      } catch(error) {
        console.log('error', error);
        setErrors(prevErrors => ({
          ...prevErrors,
          posts: 'Error: Unable to get posts'
        }));
      }
    };
    if (!posts) getPosts();
  }, [posts, page]);

  const handleVoteAction = async (id, options) => {
    if (!isAuthenticated) {
      alert("Bạn phải đăng nhập để bỏ phiếu");
      return;
    }
    try {
      const accessToken = await getAccessTokenSilently({ audience: config.auth0ApiAudience })
      await restClient.put(
        `/posts/${id}/votes`, 
        { vote_action: options.type }, 
        { 
          headers: { 
            'Authorization': `Bearer ${accessToken}`
          } 
        }
      );
      const currentPostIndex = posts.posts.findIndex(p => p.id === id);
      if (options.type === 'increment')
        posts.posts[currentPostIndex].votes++;
      else
        posts.posts[currentPostIndex].votes--;
      setPosts({
        ...posts,
        posts: [...posts.posts]
      });
    } catch (error) {
      console.log('error', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Lỗi: Server bị lỗi");
      }
    }
  }

  const handlePageSelect = (e, newPage) => {
    if (parseInt(newPage) !== parseInt(page)) {
      history.push({
        pathname: '/',
        search: `?page=${newPage}`
      });
    }
  };

  const renderPostList = () => {
    if (!posts) return null;
    return (
      <div className='post-list'>
        <ul className="post-list__list">
          {posts.posts && posts.posts.map(post => 
            <PostItem post={post} key={post.id} handleVoteAction={handleVoteAction} />)}
          {errors.posts && (<p className='post-list__error'>{errors.posts}</p>)}
        </ul>
        <Pagination
          classes={{ul: classes.paginationList}}
          className={classes.pagination}
          count={calculatePages(posts.limit, posts.count)}
          shape="rounded"
          variant="outlined"
          color="secondary"
          size="small"
          page={parseInt(page)}
          onChange={handlePageSelect}
        />
      </div>
    );
  };

  if (isLoading) return <Loading size='large' />;

  return renderPostList();
}

Home.propTypes = {
  staticContext: PropTypes.object
};

Home.fetchData = async (request) => {
  const query = request.query;
  let page;
  const result = {
    data: null,
    error: null
  };

  if (isNaN(query.page)) page = 1;
  else page = parseInt(query.page);
  try {
    const res = await restClient.get(`/posts?page=${page}`);
    result.data = res.data;
  } catch (error) {
    result.err = error;
  }
  
  return result;
};