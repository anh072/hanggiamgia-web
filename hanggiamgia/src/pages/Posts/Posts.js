import React from 'react';
import { useDataProvider } from '../../GlobalState';
import PostItem from '../../components/PostItem/PostItem';
import './Posts.css';

export default function Posts() {
  const state = useDataProvider();
  const [posts] = state.postApi.posts;

  return (
    <ul className="post-list">
      {posts.map(post => <PostItem post={post} key={post.id} />)}
    </ul>
  );
}
