import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../lib/config';

export default function CategoryAPI() {
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      const apiBaseUrl = config.apiBaseUrl;
      try {
        const res = await axios.get(
          `${apiBaseUrl}/categories`,
          { timeout: 20000 }
        );
        setCategories(res.data.categories);
      } catch (error) {
        console.log('error', error);
        setError({ error: 'Unable to get categories' });
      }
    }
    getCategories();
  }, []);

  return {
    data: categories,
    error: error
  };
}
