import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import config from '../../lib/config';
import Comment from '../../components/Comment/Comment';
import CommentInput from '../../components/CommentInput/CommentInput';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import PostItem from '../../components/PostItem/PostItem';
import Loading from '../../components/Loading/Loading';
import './DetailedPost.css';


export default function DetailedPost() {
  const apiBaseUrl = config.apiBaseUrl;

  const { id } = useParams();
  const { isAuthenticated, user } = useAuth0();

  const [ post, setPost ] = useState(null);
  const [ comments, setComments ] = useState([]);
  const [ newComment, setNewComment ] = useState('');
  const [ offset, setOffset ] = useState(0);
  const [ count, setCount ] = useState(0);
  const [ errors, setErrors ] = useState({});
  const [ isLoadingPost, setIsLoadingPost ] = useState(false);
  const [ isLoadingComments, setIsLoadingComments ] = useState(false);
  const [ isLoadingExtraComments, setIsLoadingExtraComments ] = useState(false);

  useEffect(() => {
    const getCommentsbyPostId = async (id) => {
      try {
        setIsLoadingComments(true);
        const res = await axios.get(
          `${apiBaseUrl}/posts/${id}/comments`,
          { timeout: 20000 }
        );
        setComments(res.data.comments);
        setOffset(res.data.comments.length);
        setCount(res.data.count);
        setIsLoadingComments(false);
        setErrors(prevErrors => ({
          ...prevErrors,
          comments: ''
        }));
      } catch (error) {
        console.log('error', error);
        setIsLoadingComments(false);
        setErrors(prevErrors => ({
          ...prevErrors,
          comments: 'Unable to get comments'
        }));
      }
    };
    getCommentsbyPostId(id);
  }, [id]);

  useEffect(() => {
    const getPostById = async (id) => {
      try {
        setIsLoadingPost(true);
        const res = await axios.get(
          `${apiBaseUrl}/posts/${id}`,
          { timeout: 20000 }
        );
        setPost(res.data);
        setIsLoadingPost(false);
        setErrors(prevErrors => ({
          ...prevErrors,
          post: ''
        }));
      } catch (error) {
        console.log('error', error);
        setIsLoadingPost(false);
        setErrors(prevErrors => ({
          ...prevErrors,
          post: 'Error: Unable to get post'
        }))
      }
    };
    getPostById(id);
  }, [id]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${apiBaseUrl}/posts/${id}/comments`,
        { text: newComment.trim().replace(/\n+$/, "") },
        { headers: { 'Content-Type': 'application/json', 'username': 'gmanshop' }}, //TODO: remove this
        { timeout: 20000 }
      );
      console.log("submitted comment");
      var comment = res.data;
      setComments([comment, ...comments]);
      setNewComment('');
      setCount(count + 1);
      setOffset(offset + 1);
    } catch (error) {
      console.log('error', error);
      alert('Error: Unable to submit your comment');
    }
  };

  const loadComments = async () => {
    const incrementalOffset = 5;
    const newOffset = offset + incrementalOffset;
    const startDate = comments[0].created_time;

    try {
      setIsLoadingExtraComments(true);
      const res = await axios.get(
        `${apiBaseUrl}/posts/${id}/comments?offset=${newOffset}&start_date=${startDate}`,
        { timeout: 20000 }
      );
      setComments(res.data.comments);
      setCount(res.data.count);
      setOffset(res.data.comments.length);
      setIsLoadingExtraComments(false);
    } catch (error) {
      console.log('error', error);
      setIsLoadingExtraComments(false);
      alert('Error: Unable to load more comments');
    }
  };

  const handleUpVote = async (id) => {
    if (!isAuthenticated) alert("You must be logged in to vote");
    try {
      await axios.put(
        `${apiBaseUrl}/posts/${id}/votes`, 
        { vote_action: 'increment' }, 
        { 
          headers: { 
            'Content-Type': 'application/json',
            'username': 'gmanshop' // TODO: remove this
          } 
        },
        { timeout: 20000 }
      );
      post.votes++;
      setPost({...post});
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
            'username': 'testDownVote3' // TODO: remove this
          } 
        },
        { timeout: 20000 }
      );
      post.votes--;
      setPost({...post});
    } catch (error) {
      console.log('error', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Unexpected error has occured");
      }
    }
  }
  
  const handleCommentUpdate = async (commentId, newText) => {
    try {
      const res = await axios.put(
        `${apiBaseUrl}/posts/${id}/comments/${commentId}`,
        { text: newText },
        { headers: { 'Authorization': 'Bearer xxx', 'username': 'gmanshop' } }, //TODO: remove this
        { timeout: 20000 }
      );
      const currentCommentIndex = comments.findIndex(c => c.id === commentId);
      comments[currentCommentIndex] = res.data;
      setComments([...comments]);
    } catch(error) {
      console.log('error', error);
      alert('Error: Unable to update the comment');
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(
        `${apiBaseUrl}/posts/${id}/comments/${commentId}`,
        { headers: { 'Authorization': 'Bearer xxx', 'username': 'gmanshop' } }, // TODO: remove this
        { timeout: 20000 }
      );
      const newComments = comments.filter(c => c.id !== commentId);
      setComments([...newComments]);
    } catch(error) {
      console.log('error', error);
      alert('Error: Unable to delete the comment');
    }
  };

  return (
    <div className="detailed-post">
      {
        isLoadingPost ? 
          <Loading size='medium' /> : 
          (
            <>
            {
              post && (
                <PostItem post={post} detailed={true} handleUpVote={handleUpVote} handleDownVote={handleDownVote} />
                )
            }
            {
              errors.post && (<p className='detailed-post__error'>{errors.post}</p>)
            }
            </>
          )
      }
      
      <h2>Comments</h2>
      {
        isLoadingComments ? 
          <Loading size='medium' /> :
          (
            <>
              { isAuthenticated && <CommentInput onSubmit={handleSubmit} onChange={setNewComment}/> }
              { count > 0 &&
                comments.map(comment => {
                  if (isAuthenticated && user[config.claimNamespace+'username'] === comment.author)
                    return <Comment 
                      editable={true} 
                      onDelete={handleCommentDelete}
                      onUpdate={handleCommentUpdate}
                      comment={comment} 
                      key={comment.id} />
                  return <Comment comment={comment} key={comment.id} />
                })
              }
              {
                errors.comments && (<p className='detailed-post__error'>{errors.comments}</p>)
              }
              {
                offset < count && (
                  <div className="comment-loader detailed-post__load">
                    <div className="comment-loader__button comment-loader_text" onClick={loadComments}>View more comments</div>
                    <div className="comment-loader_text">{offset}/{count}</div>
                  </div>
                )
              }
              { isLoadingExtraComments && <Loading size='small' /> }
            </>
          )
      }
    </div>
  );
}
