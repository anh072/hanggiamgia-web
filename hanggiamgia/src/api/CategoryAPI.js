import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../lib/config';

export default function CategoryAPI() {
  const [categories, setCategories] = useState([]);
  const apiBaseUrl = config.apiBaseUrl;

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/categories`);
        setCategories(res.data.categories);
      } catch (error) {
        console.log('error', error);
      }
    }
    getCategories();
  }, []);

  return {
    categories: [categories, setCategories]
  };
}
