import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../lib/config';

export default function PostAPI() {
  const apiBaseUrl = config.apiBaseUrl;
  const [ page, setPage ]= useState(1);
  const [ category, setCategory ] = useState("");
  const [ posts, setPosts ] = useState([]);
  const [ prev, setPrev ] = useState("");
  const [ next, setNext ] = useState("");

  useEffect(() => {
    const getPosts = async () => {
      const res = await axios.get(`${apiBaseUrl}/posts?page=${page}&category=${category}`);
      setPosts(res.data.posts);
      setPrev(res.data.prev);
      setNext(res.data.next);
    }
    getPosts();
    console.log("Fetched Posts")
  }, [page, category]);

  return {
    posts: [posts, setPosts],
    category: [category, setCategory],
    page: [page, setPage],
    prev: [prev, setPrev],
    next: [next, setNext]
  };
}
