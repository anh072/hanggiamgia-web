import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { useAuth0 } from '@auth0/auth0-react';
import PropTypes from 'prop-types';
import { restClient } from '../../client/index';
import config from '../../lib/config';
import Comment from '../../components/Comment/Comment';
import CommentInput from '../../components/CommentInput/CommentInput';
import PostItem from '../../components/PostItem/PostItem';
import Loading from '../../components/Loading/Loading';
import NotFound from '../NotFound/NotFound';
import './DetailedPost.css';

export default function DetailedPost({ staticContext }) {

  const { id } = useParams();
  const history = useHistory();
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  const [state, setState] = useState(() => {
    if (staticContext && staticContext.data) {
      return {
        post: staticContext.data.post,
        comments: staticContext.data.comments.comments,
        offset: staticContext.data.comments.comments.length,
        count: staticContext.data.comments.count,
      };
    }

    if (typeof window !== 'undefined' && window.__INITIAL_DATA__) {
      console.log('try to read initial data');
      const initialData = window.__INITIAL_DATA__;
      delete window.__INITIAL_DATA__;
      return {
        post: initialData.post,
        comments: initialData.comments.comments,
        offset: initialData.comments.comments.length,
        count: initialData.comments.count,
      };
    }
    return {};
  });

  const [ newComment, setNewComment ] = useState('');
  const [ errors, setErrors ] = useState({});
  const [ isLoadingPost, setIsLoadingPost ] = useState(false);
  const [ isLoadingComments, setIsLoadingComments ] = useState(false);
  const [ isLoadingExtraComments, setIsLoadingExtraComments ] = useState(false);
  const [ open, setOpen ] = useState(false);

  useEffect(() => {
    const getCommentsbyPostId = async (id) => {
      try {
        setIsLoadingComments(true);
        const res = await restClient.get(`/posts/${id}/comments`);
        const data = res.data;
        setState(prevState => ({
          ...prevState,
          comments: data.comments,
          offset: data.comments.length,
          count: data.count
        }));
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
          comments: 'Lỗi: Không tải được bình luận'
        }));
      }
    };
    if (!state.comments) getCommentsbyPostId(id);
  }, [state.comments, id]);

  useEffect(() => {
    const getPostById = async (id) => {
      try {
        setIsLoadingPost(true);
        const res = await restClient.get(`/posts/${id}`);
        const data = res.data;
        setState(prevState => ({
          ...prevState,
          post: data
        }));
        setIsLoadingPost(false);
        setErrors(prevErrors => ({
          ...prevErrors,
          post: ''
        }));
      } catch (error) {
        console.log('error', error);
        setIsLoadingPost(false);
        if (error.response && error.response.status === 404) {
          setErrors(prevErrors => ({
            ...prevErrors,
            notfound: 'Lỗi: Bài viết không tồn tại'
          }));
        } else {
          setErrors(prevErrors => ({
            ...prevErrors,
            post: 'Lỗi: Không tải được bài viết'
          }));
        }
      }
    };
    if (!state.post) getPostById(id);
  }, [state.post, id]);

  const handleSubmit = async () => {
    try {
      const accessToken = await getAccessTokenSilently({ audience: config.auth0ApiAudience });
      const res = await restClient.post(`/posts/${id}/comments`,
        { text: newComment.trim().replace(/\n+$/, "") },
        { headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${accessToken}` } }
      );
    
      var comment = res.data;
      setState({
        ...state,
        comments: [comment, ...state.comments],
        count: state.count + 1,
        offset: state.offset + 1
      });
      setNewComment('');
    } catch (error) {
      console.log('error', error);
      alert('Lỗi: Không thể gửi bình luận của bạn');
    }
  };

  const loadComments = async () => {
    const incrementalOffset = 5;
    const newOffset = state.offset + incrementalOffset;
    const startDate = state.comments[0].created_time;

    try {
      setIsLoadingExtraComments(true);
      const res = await restClient.get(
        `/posts/${id}/comments?offset=${newOffset}&start_date=${startDate}`
      );
      setState({
        ...state,
        comments: res.data.comments,
        count: res.data.count,
        offset: res.data.comments.length
      });
      setIsLoadingExtraComments(false);
    } catch (error) {
      console.log('error', error);
      setIsLoadingExtraComments(false);
      alert('Lỗi: Không thể tải thêm bình luận');
    }
  };

  const handleVoteAction = async (id, options) => {
    if (!isAuthenticated) {
      alert("Bạn phải đăng nhập để bỏ phiếu");
      return;
    }
    try {
      const accessToken = await getAccessTokenSilently({ audience: config.auth0ApiAudience });
      await restClient.put(`/posts/${id}/votes`,
        { vote_action: options.type }, 
        { headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        } }
      );
      if (options.type === 'increment') state.post.votes++;
      else state.post.votes--;
      setState({...state, post: state.post});
    } catch (error) {
      console.log('error', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Server đang bị lỗi");
      }
    }
  }

  const handlePostDelete = async () => {
    try {
      const accessToken = await getAccessTokenSilently({ audience: config.auth0ApiAudience });
      await restClient.delete(`/posts/${id}`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } });
      setOpen(false);
      history.push('/');
    } catch (error){
      console.log('error', error);
      setOpen(false);
      alert('Lỗi: Không thể xóa bài viết');
    }
  };
  
  const handleCommentUpdate = async (commentId, newText) => {
    try {
      const accessToken = await getAccessTokenSilently({ audience: config.auth0ApiAudience });
      const res = await restClient.put(`/posts/${id}/comments/${commentId}`,
        { text: newText },
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      const currentCommentIndex = state.comments.findIndex(c => c.id === commentId);
      state.comments[currentCommentIndex] = res.data;
      setState({
        ...state,
        comments: [...state.comments]
      });
    } catch(error) {
      console.log('error', error);
      alert('Lỗi: Không thể cập nhật bình luận');
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const accessToken = await getAccessTokenSilently({ audience: config.auth0ApiAudience });
      await restClient.delete(`/posts/${id}/comments/${commentId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const newComments = state.comments.filter(c => c.id !== commentId);
      setState({
        ...state,
        comments: [...newComments]
      });
    } catch(error) {
      console.log('error', error);
      alert('Lỗi: Không thể xóa bình luận');
    }
  };

  if (errors.notfound) {
    return <NotFound />;
  }

  return (
    <div className="detailed-post">
      {
        isLoadingPost ? 
          <Loading size='medium' /> : 
          (
            <>
            {
              state && state.post && (
                  <PostItem 
                    post={state.post} 
                    detailed={true} 
                    handleVoteAction={handleVoteAction} 
                    handlePostDelete={setOpen} />
                )
            }
            {
              errors.post && (<p className='detailed-post__error'>{errors.post}</p>)
            }
            </>
          )
      }
      
      <h2 className='detailed-post__comment-header'>Bình luận</h2>
      {
        isLoadingComments ? 
          <Loading size='medium' /> :
          (
            <>
              { isAuthenticated && <CommentInput onSubmit={handleSubmit} onChange={setNewComment}/> }
              { state && state.count > 0 &&
                state && state.comments.map(comment => {
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
                state && state.offset < state.count && (
                  <div className="comment-loader detailed-post__load">
                    <div className="comment-loader__button comment-loader_text" onClick={loadComments}>Xem thêm bình luận</div>
                    <div className="comment-loader_text">{state.offset}/{state.count}</div>
                  </div>
                )
              }
              { isLoadingExtraComments && <Loading size='small' /> }
            </>
          )
      }

      <div>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
        >
          <DialogTitle>Bạn thực sự muốn xóa?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Hủy
            </Button>
            <Button onClick={handlePostDelete} color="secondary" autoFocus>
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </div>  
    </div>
  );
}

DetailedPost.propTypes = {
  staticContext: PropTypes.object
};

DetailedPost.fetchData = async (request) => {
  const path = request.path;
  const id = path.split('/').slice(-1)[0];
  let data;
  let err;
  try {
    const postResponse = await restClient.get(`/posts/${id}`);
    const commentsResponse = await restClient.get(`/posts/${id}/comments`);
    data = {
      post: postResponse.data,
      comments: commentsResponse.data
    };
  } catch (error) {
    err = error;
  }

  return {
    data: data,
    error: err
  };
};