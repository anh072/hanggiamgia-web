import React from 'react';
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom';
import { readFileSync } from 'fs'
import serialize from 'serialize-javascript';
import { DataProvider } from '../../src/GlobalState';
import { ServerStyleSheets } from '@material-ui/core/styles';
import { indexFilePath } from '../files';

export const render = (ReactElement, path, context) => {
  const html = readFileSync(indexFilePath).toString();
  const sheets = new ServerStyleSheets();

  const content = renderToString(
    sheets.collect(
      <DataProvider initialProps={context.store}>
        <StaticRouter location={path} context={context}>
          <ReactElement />
        </StaticRouter>
      </DataProvider>
    )
  );

  const css = sheets.toString();

  return html
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`)
    .replace('</head>', `<style id="jss-server-side">${css}</style></head>`)
    .replace(
      '</head>', 
      `<script>window.__INITIAL_DATA__ = ${context && context.data ? serialize(context.data) : null}</script></head>`
    )
    .replace(
      '</head>',
      `<script>window.__INITIAL_STORE__ = ${serialize(context.store)}</script></head>`
    );
};