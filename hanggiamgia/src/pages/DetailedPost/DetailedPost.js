import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import config from '../../lib/config';
import NotFound from '../NotFound/NotFound';
import Comment from '../../components/Comment/Comment';
import CommentInput from '../../components/CommentInput/CommentInput';
import axios from 'axios';
import PostItem from '../../components/PostItem/PostItem';
import './DetailedPost.css';


export default function DetailedPost() {
  const apiBaseUrl = config.apiBaseUrl;

  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const getPostById = async (id) => {
      try {
        const res = await axios.get(`${apiBaseUrl}/posts/${id}`);
        setPost(res.data);
      } catch (error) {
        console.log('error', error);
      }
    };
    
    const getCommentsbyPostId = async (id) => {
      try {
        const res = await axios.get(`${apiBaseUrl}/posts/${id}/comments`);
        setComments(res.data.comments);
        setOffset(res.data.comments.length);
        setCount(res.data.count);
      } catch (error) {
        console.log('error', error);
      }
    };

    getPostById(id);
    getCommentsbyPostId(id);
  }, [id]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${apiBaseUrl}/posts/${id}/comments`,
        { text: newComment.trim().replace(/\n+$/, "") },
        { headers: { 'Content-Type': 'application/json', 'username': 'com' }} //TODO: remove this
      );
      console.log("submitted comment");
      var comment = res.data;
      setComments([comment, ...comments]);
      setNewComment('');
      setCount(count + 1);
      setOffset(offset + 1);
    } catch (error) {
      console.log('error', error);
    }
  };

  const loadComments = async () => {
    const incrementalOffset = 5;
    const newOffset = offset + incrementalOffset;
    const startDate = comments[0].created_time;

    try {
      const res = await axios.get(`${apiBaseUrl}/posts/${id}/comments?offset=${newOffset}&start_date=${startDate}`);
      setComments(res.data.comments);
      setCount(res.data.count);
      setOffset(res.data.comments.length);
    } catch (error) {
      console.log('error', error);
    }
  };

  if (post == null) return <NotFound />;
  
  return (
    <div className="detailed-post">
      <PostItem post={post} detailed={true} />
      <h2>Comments</h2>
      <CommentInput onSubmit={handleSubmit} onChange={setNewComment}/>
      { count > 0 &&
        comments.map(comment => <Comment comment={comment} key={comment.id} />)
      }
      {
        offset < count && (
          <div className="comment-loader detailed-post__load">
            <div className="comment-loader__button comment-loader_text" onClick={loadComments}>View more comments</div>
            <div className="comment-loader_text">{offset}/{count}</div>
          </div>
        )
      }
    </div>
  );
}
