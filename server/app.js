import React from 'react';
import koa from 'koa';
import http from 'koa-route';
import serve from 'koa-static';
import { matchPath } from 'react-router-dom';
import routes from '../src/pages/routes';
import { render } from './lib/render';
import App from '../src/App';
import { assets, images } from './files';
import { fetchInitialData } from './lib/fetchInitialData';
import ReasonAPI from '../src/api/ReportAPI';
import CategoryAPI from '../src/api/CategoryAPI';

export const app = new koa();

const handler = async (ctx) => {
  const currentRoute = routes.find(route => matchPath(ctx.request.path, route)) || {};
  const Component = currentRoute.component;

  try {
    let initialData = await fetchInitialData(Component, ctx);
    const context = { data: initialData };
    const reasons = await ReasonAPI.fetchData();
    const categories = await CategoryAPI.fetchData();
    context.store = {
      reasons: reasons,
      categories: categories
    };
    ctx.body = render(App, ctx.request.path, context);
  } catch (error) {
    console.error(error);
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      message: 'Internal Server Error'
    };
  }
};

app.use(http.get('/', handler));

app.use(serve(images));
app.use(serve(assets));

app.use(http.get('*', handler));