import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { ReduxProvider } from "ux-redux-module";
import { BrowserRouter } from "react-router-dom";
import { Routers } from "ux-autoroute";
import { routeConfig } from "../config/router.js";
export var run = function run(_ref) {
  var modules = _ref.modules,
      _ref$router = _ref.router,
      NoMatch = _ref$router.NoMatch,
      before = _ref$router.before,
      after = _ref$router.after;
  ReactDOM.render( /*#__PURE__*/React.createElement(ReduxProvider, {
    value: modules
  }, /*#__PURE__*/React.createElement(BrowserRouter, null, /*#__PURE__*/React.createElement(Routers, {
    routers: routeConfig,
    noMatch: NoMatch,
    before: before,
    after: after
  }))), document.getElementById("root")); // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA

  serviceWorker.unregister();
};