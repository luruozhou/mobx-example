import React from 'react';
import { useRouterHistory, Router, Route } from 'react-router';
import createHistory from 'history/lib/createBrowserHistory';

let history = useRouterHistory(createHistory)();

let pages = {
  Home: () => import('../pages/home/index'),
};

const routes = (
  <Router history={history}>
    <Route path="/" getComponent={toGetter(pages.Home)} />
  </Router>
);

function toGetter(loader) {
  return (state, callback) => {
    loader().then(x => {
      x = x.__esModule ? x.default : x;
      callback(null, x);
    });
  };
}

export default routes;
