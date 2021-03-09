
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react']
});

require.extensions[".css"] = function() {
  return null;
};

require.extensions[".png"] = function() {
  return null;
};

const Routes = require('./src/pages/Pages').Routes;
const Sitemap = require('react-router-sitemap').default;
const restClient = require('./src/client/index').restClient;

async function generateSitemap() {
  try {
    const res = await restClient.get('/posts/max-id');
    const maxId = res.data.id;
    
    let idMap = [];
    for(var i = maxId; i > 0; i--) {
      idMap.push({ id: i });
    }

    const paramsConfig  = {
      '/posts/:id': idMap
    };

    const filterConfig = {
      isValid: false,
      rules: [
        /\/users\/:username/,
        /\/posts\/search/,
        /\/posts\/submit/,
        /\/posts\/:id\/edit/,
        /\/posts\/:id\/votes/,
        /\*/
      ]
    };

    return new Sitemap(Routes())
      .filterPaths(filterConfig)
      .applyParams(paramsConfig)
      .build('https://www.giarevn.net')
      .save('./public/sitemap.xml');
  } catch(e) {
    console.log(e);
  }
}

generateSitemap();