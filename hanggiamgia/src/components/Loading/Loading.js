import React from 'react';

export default function Loading() {
  const loadingImg = "https://cdn.auth0.com/blog/auth0-react-sample/assets/loading.svg";
  return (
    <div>
      <img src={loadingImg} alt="Loading..." />
    </div>
  );
}
