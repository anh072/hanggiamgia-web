import { withAuthenticationRequired } from '@auth0/auth0-react';
import React from 'react';
import { Route } from 'react-router-dom';

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
