import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/styles';
import Loading from '../../components/Loading/Loading';
import PostItem from '../../components/PostItem/PostItem';
import config from '../../lib/config';
import { calculatePages, useQuery } from '../../lib/common';
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

export default function Posts() {
  const apiBaseUrl = config.apiBaseUrl
  const classes = useStyles();
  const query = useQuery();
  const page = query.get('page') || 1;

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const history = useHistory();

  const [ posts, setPosts ] = useState({});
  const [ isLoading, setIsLoading ] = useState(false);
  const [ errors, setErrors ] = useState({});

  useEffect(() => {
    const getPosts = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${apiBaseUrl}/posts?page=${page}`,
          { timeout: 20000 }
        );
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
    getPosts();
  }, [page]);

  const handleUpVote = async (id) => {
    if (!isAuthenticated) alert("You must be logged in to vote");
    try {
      const accessToken = await getAccessTokenSilently({ audience: config.auth0ApiAudience })
      await axios.put(
        `${apiBaseUrl}/posts/${id}/votes`, 
        { vote_action: 'increment' }, 
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'username': user[config.claimNamespace+'username']
          } 
        },
        { timeout: 20000 }
      );
      const currentPostIndex = posts.posts.findIndex(p => p.id === id);
      posts.posts[currentPostIndex].votes++;
      setPosts({
        ...posts,
        posts: [...posts.posts]
      });
    } catch (error) {
      console.log('error', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Unexpected error has occured");
      }
    }
  }

  const handleDownVote = async (id) => {
    if (!isAuthenticated) alert("You must be logged in to vote");
    try {
      const accessToken = await getAccessTokenSilently({ audience: config.auth0ApiAudience })
      await axios.put(
        `${apiBaseUrl}/posts/${id}/votes`, 
        { vote_action: 'decrement' }, 
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'username': user[config.claimNamespace+'username']
          } 
        },
        { timeout: 20000 }
      );
      const currentPostIndex = posts.posts.findIndex(p => p.id === id);
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
        alert("Unexpected error has occured");
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

  if (isLoading) return <Loading size='large' />;

  return (
    <div className='post-list'>
      <ul className="post-list__list">
        {posts.posts && posts.posts.map(post => 
          <PostItem post={post} key={post.id} handleUpVote={handleUpVote} handleDownVote={handleDownVote} />)}
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
}
