import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { ReduxProvider } from "ux-redux-module";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { Routers } from "ux-autoroute";

var App = function App(_ref) {
  var NoMatch = _ref.NoMatch,
      _before = _ref.before,
      after = _ref.after,
      useHook = _ref.useHook,
      isHashRouter = _ref.isHashRouter,
      router = _ref.router;
  var result = useHook();
  return /*#__PURE__*/React.createElement(Router, {
    isHashRouter: isHashRouter
  }, /*#__PURE__*/React.createElement(Routers, {
    routers: router,
    noMatch: NoMatch,
    before: function before(location) {
      if (_before) {
        return _before(location, result);
      }
    },
    after: after
  }));
};

var Router = function Router(_ref2) {
  var children = _ref2.children,
      isHashRouter = _ref2.isHashRouter;
  return isHashRouter ? /*#__PURE__*/React.createElement(HashRouter, null, children) : /*#__PURE__*/React.createElement(BrowserRouter, null, children);
};

export var run = function run(_ref3) {
  var modules = _ref3.modules,
      router = _ref3.router;
  ReactDOM.render( /*#__PURE__*/React.createElement(ReduxProvider, {
    value: modules
  }, /*#__PURE__*/React.createElement(App, router)), document.getElementById("root")); // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA

  serviceWorker.unregister();
};