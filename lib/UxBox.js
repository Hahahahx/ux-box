import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { Routers } from "ux-autoroute";

var RouteComponent = function RouteComponent(_ref) {
  var NoMatch = _ref.NoMatch,
      isHashRouter = _ref.isHashRouter,
      router = _ref.router;
  return /*#__PURE__*/React.createElement(Routers, {
    type: isHashRouter ? "hash" : "history",
    routers: router,
    noMatch: NoMatch
  });
};

export var run = function run(_ref2) {
  var router = _ref2.router;
  ReactDOM.render( /*#__PURE__*/React.createElement(RouteComponent, router), document.getElementById("root")); // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA

  serviceWorker.unregister();
};