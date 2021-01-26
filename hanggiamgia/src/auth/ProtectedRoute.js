import { withAuthenticationRequired } from '@auth0/auth0-react';
import React from 'react';
import { Route } from 'react-router-dom';
import Loading from '../components/Loading/Loading';

export default function ProtectedRoute({ component, ...args }) {
  return (
    <Route 
      component={withAuthenticationRequired(component, {
        onRedirecting: () => 'Redirecting ...'
      })}
      {...args}
    />
  )
}
