import { useState, useEffect } from 'react';
import { restClient } from '../client';

export default function CategoryAPI() {
  const [categories, setCategories] = useState(() => {
    if(window && window.__INITIAL_STORE__) {
      const data = window.__INITIAL_STORE__.categories;
      delete window.__INITIAL_STORE__.categories;
      return data;
    }
    return null;
  });

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await restClient.get('/categories');
        setCategories(res.data.categories);
      } catch (error) {
        console.log('error', error);
      }
    }
    if (!categories) getCategories();
  }, [categories]);

  return {
    data: categories,
  };
}

CategoryAPI.fetchData = async () => {
  const res = await restClient.get('/categories');
  return res.data.categories;
};
