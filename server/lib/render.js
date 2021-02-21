import React from 'react';
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom';
import { readFileSync } from 'fs'
import serialize from 'serialize-javascript';
import { DataProvider } from '../../src/GlobalState';
//import Auth0ProviderWithHistory from '../../src/auth/Auth0ProviderWithHistory';
import { ServerStyleSheets } from '@material-ui/core/styles';
import { indexFilePath } from '../files';

export const render = (ReactElement, path, context) => {
  const html = readFileSync(indexFilePath).toString();
  const sheets = new ServerStyleSheets();

  const content = renderToString(
    sheets.collect(
      <DataProvider>
        <StaticRouter location={path} context={context}>
          {/* //<Auth0ProviderWithHistory> */}
            <ReactElement />
          {/* </Auth0ProviderWithHistory> */}
        </StaticRouter>
      </DataProvider>
    )
  );

  const css = sheets.toString();

  return html
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`)
    .replace(
      '</body>', 
      `<script>window.__INITIAL_DATA__ = ${context && context.data ? serialize(context.data) : null}</script></body>`
    )
    .replace('</head>', `<style id="jss-server-side">${css}</style></head>`);
};