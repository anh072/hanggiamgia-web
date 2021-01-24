import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Posts from './Posts/Posts';
import DetailedPost from './DetailedPost/DetailedPost';
import UserProfile from './UserProfile/UserProfile';
import NotFound from './NotFound/NotFound';
import Profile from './UserProfile/UserProfile';
import PostVotes from './PostVotes/PostVotes';
import ProtectedRoute from '../auth/ProtectedRoute';

export default function Pages() {
  return (
    <Switch>
      <Route path="/" exact component={Posts} />
      <Route path="/posts/:id" exact component={DetailedPost} />
      <ProtectedRoute path="/posts/:id/votes" exact component={PostVotes} />
      <Route path="/users/:username" exact component={UserProfile} />
      <ProtectedRoute path="/profile" exact component={Profile} />
      <Route path="*" exact component={NotFound} />
    </Switch>
  );
}