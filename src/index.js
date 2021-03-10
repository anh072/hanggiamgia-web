import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from './GlobalState';
import Auth0ProviderWithHistory from './auth/Auth0ProviderWithHistory';
import './index.css';


function Main() {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.StrictMode>
      <DataProvider>  
        <BrowserRouter>
          <Auth0ProviderWithHistory>
            <App />
          </Auth0ProviderWithHistory>
        </BrowserRouter>
      </DataProvider>
    </React.StrictMode>
  );
}

ReactDOM.hydrate(<Main /> ,document.getElementById('root'));
