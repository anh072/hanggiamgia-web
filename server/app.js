import React from 'react';
import koa from 'koa';
import http from 'koa-route';
import serve from 'koa-static';
import { matchPath } from 'react-router-dom';
import routes from '../src/pages/routes';
import { render } from './lib/render';

import App from '../src/App';
import { assets, images } from './files';

export const app = new koa();

const handler = async (ctx) => {
  const currentRoute = routes.find(route => matchPath(ctx.request.path, route)) || {};
  const Component = currentRoute.component;
  let initialData = null;
  if (Component.fetchData) {
    initialData = await Component.fetchData();
  }
  const context = { data: initialData };
  ctx.body = render(App, ctx.request.path, context);
};

app.use(http.get('/', handler));

app.use(serve(images));
app.use(serve(assets));

app.use(http.get('*', handler));