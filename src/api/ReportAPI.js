import { useState, useEffect } from 'react';
import { restClient } from '../client';

export default function ReasonAPI() {
  const [ reasons, setReasons ] = useState(() => {
    if(window && window.__INITIAL_STORE__) {
      const data = window.__INITIAL_STORE__.reasons;
      delete window.__INITIAL_STORE__.reasons;
      return data;
    }
    return null;
  });

  useEffect(() => {
    const getReasons = async () => {
      try {
        const res = await restClient.get('/reasons');
        setReasons(res.data.reasons);
      } catch (error) {
        console.log('error', error);
      }
    }
    if (!reasons) getReasons();
  }, [reasons]);

  return {
    data: reasons,
  };
}

ReasonAPI.fetchData = async () => {
  const res = await restClient.get('/reasons');
  return res.data.reasons;
};