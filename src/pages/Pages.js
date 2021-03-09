import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import routes from './routes';
import './Pages.css';

export const Routes = () => (
  <Switch>
    {
      routes.map((route, i) => {
        if (route.protected) {
          return <ProtectedRoute key={i} {...route} />
        }
        return <Route key={i} {...route} />
      })
    }
  </Switch>
);

export default function Pages() {
  return (
    <div className='pages'>
      <Routes />
    </div>
  );
}