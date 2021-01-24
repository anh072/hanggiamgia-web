
import './App.css';
import Header from './components/Header/Header';
import { BrowserRouter } from 'react-router-dom';
import Pages from './pages/Pages';
import { DataProvider } from './GlobalState';
import Auth0ProviderWithHistory from './auth/Auth0ProviderWithHistory';

function App() {

  return (
    <DataProvider>
      <BrowserRouter>
        <Auth0ProviderWithHistory>
          <div className="App">
            <Header />
            <Pages />
          </div>
        </Auth0ProviderWithHistory>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
