import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../lib/config';

export default function CategoryAPI() {
  const [ reasons, setReasons ] = useState([]);
  const [ error, setError ] = useState(null);
  const apiBaseUrl = config.apiBaseUrl;

  useEffect(() => {
    const getReasons = async () => {
      try {
        const res = await axios.get(
          `${apiBaseUrl}/reasons`,
          { timeout: 20000 }
        );
        setReasons(res.data.reasons);
      } catch (error) {
        console.log('error', error);
        setError({ error: 'Unable to get reasons' });
      }
    }
    getReasons();
  }, []);

  return {
    data: reasons,
    error: error
  };
}
