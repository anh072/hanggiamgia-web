import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../lib/config';

export default function CategoryAPI() {
  const [reasons, setReasons] = useState([]);
  const apiBaseUrl = config.apiBaseUrl;

  useEffect(() => {
    const getReasons = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/reasons`);
        setReasons(res.data.reasons);
      } catch (error) {
        console.log('error', error);
      }
    }
    getReasons();
  }, []);

  return {
    reasons: [reasons, setReasons]
  };
}
