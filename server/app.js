import React from 'react';
import koa from 'koa';
import http from 'koa-route';
import serve from 'koa-static';
import { matchPath } from 'react-router-dom';
import routes from '../src/pages/routes';
import { render, renderIndexHTML } from './lib/render';
import App from '../src/App';
import { assets } from './files';
import ReasonAPI from '../src/api/ReportAPI';
import CategoryAPI from '../src/api/CategoryAPI';
import Home from '../src/pages/Home/Home';
import DetailedPost from '../src/pages/DetailedPost/DetailedPost';
import UserProfile from '../src/pages/UserProfile/UserProfile';

export const app = new koa();

const handler = async (ctx) => {
  // fetch global states
  let context;
  try {
    const reasons = await ReasonAPI.fetchData();
    const categories = await CategoryAPI.fetchData();
    context = {
      store: {
        reasons: reasons,
        categories: categories
      }
    };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = {
      message: 'Internal Server Error'
    };
    return;
  }

  // find the page component
  const currentRoute = routes.find(route => matchPath(ctx.request.path, route)) || {};
  const Component = currentRoute.component;

  if (Component === Home || Component === DetailedPost || Component === UserProfile) {
    const response = await Component.fetchData(ctx.request);
    const { data, error } = response;

    if (error && error.response.status === 500) {
      console.error(error);
      ctx.status = 500;
      ctx.body = {
        message: 'Internal Server Error'
      };
      return;
    }
  
    if (error && error.response.status === 404) {
      console.error(error);
      ctx.status = 404;
      context.data = null;
    }
    
    if (!error) {
      ctx.status = 200;
      context.data = data;
    }
  
    ctx.body = render(App, ctx.request.path, context);
  } else {
    ctx.body = renderIndexHTML();
  }
};

app.use(http.get('/', handler));

app.use(serve(assets));

app.use(http.get('*', handler));