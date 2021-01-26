import React, { useState, useEffect } from 'react';
import { useDataProvider } from '../../GlobalState';
import PostItem from '../../components/PostItem/PostItem';
import config from '../../lib/config';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import './Posts.css';
import Loading from '../../components/Loading/Loading';


export default function Posts() {
  const apiBaseUrl = config.apiBaseUrl

  const state = useDataProvider();
  const [category, setCategory] = state.selectedCategory;
  const [_, setSearchTerm] = state.searchTerm;

  const { isAuthenticated } = useAuth0();

  const [ page, setPage ] = useState(1);
  const [ posts, setPosts ] = useState([]);
  const [ next, setNext ] = useState(null);
  const [ prev, setPrev ] = useState(null);
  const [ count, setCount ] = useState(0);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ errors, setErrors ] = useState({});

  useEffect(() => {
    const getPosts = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${apiBaseUrl}/posts?page=${page}&category=${category}`);
        setPosts(res.data.posts);
        setNext(res.data.next);
        setPrev(res.data.prev);
        setCount(res.data.count);
        setIsLoading(false);
      } catch(error) {
        console.log('error', error);
        setErrors(prevErrors => ({
          ...prevErrors,
          posts: 'Error: Unable to get posts'
        }));
      }
    };
    getPosts();
  }, [page, category]);

  const handleUpVote = async (id) => {
    if (!isAuthenticated) alert("You must be logged in to vote");
    try {
      await axios.put(
        `${apiBaseUrl}/posts/${id}/votes`, 
        { vote_action: 'increment' }, 
        { 
          headers: { 
            'Content-Type': 'application/json',
            'username': 'testvotes2' // TODO: remove this
          } 
        }
      );
      const currentPostIndex = posts.findIndex(p => p.id === id);
      posts[currentPostIndex].votes++;
      setPosts([...posts]);
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
      await axios.put(
        `${apiBaseUrl}/posts/${id}/votes`, 
        { vote_action: 'decrement' }, 
        { 
          headers: { 
            'Content-Type': 'application/json',
            'username': 'testDownVote2' // TODO: remove this
          } 
        }
      );
      const currentPostIndex = posts.findIndex(p => p.id === id);
      posts[currentPostIndex].votes--;
      setPosts([...posts]);
    } catch (error) {
      console.log('error', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Unexpected error has occured");
      }
    }
  }

  if (isLoading) return <Loading />;

  return (
    <ul className="post-list">
      {posts.map(post => <PostItem post={post} key={post.id} handleUpVote={handleUpVote} handleDownVote={handleDownVote}/>)}
      {errors.posts && (<p className='post-list__error'>{errors.posts}</p>)}
    </ul>
  );
}
