import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home/Home';
import DetailedPost from './DetailedPost/DetailedPost';
import UserProfile from './UserProfile/UserProfile';
import NotFound from './NotFound/NotFound';
import PostVotes from './PostVotes/PostVotes';
import SearchResults from './SearchResults/SearchResults';
import ProtectedRoute from '../auth/ProtectedRoute';
import './Pages.css';

export default function Pages() {
  return (
    <div className='pages'>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/posts/search" exact component={SearchResults} />
        <Route path="/posts/:id" exact component={DetailedPost} />
        <ProtectedRoute path="/posts/:id/votes" exact component={PostVotes} />
        <Route path="/users/:username" exact component={UserProfile} />
        <Route path="*" exact component={NotFound} />
      </Switch>
    </div>
  );
}