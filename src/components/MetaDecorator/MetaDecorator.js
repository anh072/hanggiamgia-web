import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import config from '../../lib/config';

function MetaDecorator({ title, description, imageUrl, pageUrl }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description}/>
      <meta property='og:description' content={description}/>
      <meta property='og:title' content={title}/>
      <meta property='og:image' content={imageUrl}/>
      <meta property='og:url' content={`${config.hostname}${pageUrl}`}/>
      <meta property='og:type' content='website'/>
    </Helmet>
  );
}

MetaDecorator.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  pageUrl: PropTypes.string.isRequired
};

export default MetaDecorator;
