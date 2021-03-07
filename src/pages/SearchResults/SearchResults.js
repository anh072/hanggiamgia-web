import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import PostItem from '../../components/PostItem/PostItem';
import config from '../../lib/config';
import { calculatePages, useQuery } from '../../lib/common';
import { restClient } from '../../client/index';
import './SearchResults.css';

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

function SearchResults() {

  const classes = useStyles();

  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const history = useHistory();
  const query = useQuery();
  const category = query.get('category');
  const term = query.get('term');
  const page = query.get('page');

  // local state
  const [ posts, setPosts ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ errors, setErrors ] = useState({});

  useEffect(() => {
    const searchPosts = async () => {
      try {
        setIsLoading(true);
        const res = await restClient.get(`/posts/search?page=${page}&category=${category}&term=${term}`);
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
    searchPosts();
  }, [page, category, term]);

  const handleVoteAction = async (id, options) => {
    if (!isAuthenticated) {
      alert("Bạn phải đăng nhập để bỏ phiếu");
      return;
    }
    try {
      const accessToken = await getAccessTokenSilently({ audience: config.auth0ApiAudience });
      await restClient.put(
        `/posts/${id}/votes`, 
        { vote_action: options.type }, 
        { headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        } }
      );
      const currentPostIndex = posts.findIndex(p => p.id === id);
      if (options.type === 'increment') posts[currentPostIndex].votes++;
      else posts[currentPostIndex].votes--;
      setPosts([...posts]);
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
    if (parseInt(page) !== parseInt(newPage)) {
      history.push({
        pathname: '/posts/search',
        search: `?page=${newPage}&term=${term}&category=${category}`
      })
    }
  };

  if (isLoading) return <Loading size='large' />;

  return (
    <div className='search-results'>
      <div className='search-results__header'>
        <h2 className='search-results__title'>Kết quả tìm kiếm</h2>
        <p className='search-results__info'>
          <span><b>Hạng mục:</b> {category ? category : 'Tất cả'}</span>
          <span><b>Từ khóa:</b> {term ? term : ''}</span>
        </p>
      </div>
      <ul className="search-results__list">
        {posts.posts && posts.posts.map(post => 
          <PostItem post={post} key={post.id} handleVoteAction={handleVoteAction} />)}
        {errors.posts && (<p className='search-results__error'>{errors.posts}</p>)}
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


export default SearchResults;
