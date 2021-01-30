import React, { useContext } from 'react';
import Header from './components/Header/Header';
import { BrowserRouter } from 'react-router-dom';
import Pages from './pages/Pages';
import Footer from './components/Footer/Footer';
import { DataProvider } from './GlobalState';
import Auth0ProviderWithHistory from './auth/Auth0ProviderWithHistory';
import './App.css';

function App() {

  return (
    <DataProvider>
      <BrowserRouter>
        <Auth0ProviderWithHistory>
          <div className="App">
            <Header />
            <Pages />
            <Footer />
          </div>
        </Auth0ProviderWithHistory>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
