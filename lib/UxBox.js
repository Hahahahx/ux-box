import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { Routers } from "ux-autoroute";

var RouteComponent = function RouteComponent(params) {
  return /*#__PURE__*/React.createElement(Routers, params);
};

export var run = function run(params) {
  ReactDOM.render( /*#__PURE__*/React.createElement(RouteComponent, params), document.getElementById("root")); // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA

  serviceWorker.unregister();
};