import React from 'react';
import PropTypes from 'prop-types';
import './Loading.css';

function Loading({ size }) {
  const loadingImg = "https://cdn.auth0.com/blog/auth0-react-sample/assets/loading.svg";
  return (
    <div>
      <img className={`loader--${size}`} src={loadingImg} alt="Loading..." />
    </div>
  );
}

Loading.propTypes = {
  size: PropTypes.oneOf(['large', 'medium', 'small'])
};

export default Loading;