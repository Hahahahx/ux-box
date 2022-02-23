import "core-js/modules/es.object.keys.js";
import "core-js/modules/es.symbol.js";
import "core-js/modules/es.array.filter.js";
import "core-js/modules/es.object.to-string.js";
import "core-js/modules/es.object.get-own-property-descriptor.js";
import "core-js/modules/web.dom-collections.for-each.js";
import "core-js/modules/es.object.get-own-property-descriptors.js";
import "core-js/modules/es.object.define-properties.js";
import "core-js/modules/es.object.define-property.js";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { Routers } from "ux-autoroute";
import { jsx as _jsx } from "custom-jsx-library/jsx-runtime";

var RouteComponent = function RouteComponent(_ref) {
  var NoMatch = _ref.NoMatch,
      isHashRouter = _ref.isHashRouter,
      router = _ref.router;
  return _jsx(Routers, {
    type: isHashRouter ? "hash" : "history",
    routers: router,
    noMatch: NoMatch
  });
};

export var run = function run(_ref2) {
  var router = _ref2.router;
  ReactDOM.render(_jsx(RouteComponent, _objectSpread({}, router)), document.getElementById("root")); // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA

  serviceWorker.unregister();
};