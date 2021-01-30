import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../lib/config';

export default function CategoryAPI() {
  const [ categories, setCategories ] = useState([]);
  const [ error, setError ] = useState(null);
  const apiBaseUrl = config.apiBaseUrl;

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axios.get(
          `${apiBaseUrl}/categories`,
          { timeout: 20000 }
        );
        setCategories(res.data.categories);
      } catch (error) {
        console.log('error', error);
        setError({ error: 'Unable to get report reasons' });
      }
    }
    getCategories();
  }, []);

  return {
    data: [categories, setCategories],
    error: error
  };
}
