import "core-js/modules/es.array.index-of";
import "core-js/modules/es.array.iterator";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.promise";
import "core-js/modules/es.regexp.exec";
import "core-js/modules/es.string.iterator";
import "core-js/modules/es.string.match";
import "core-js/modules/web.dom-collections.iterator";
import "core-js/modules/web.url";
import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { ReduxProvider } from "ux-redux-module";
import { BrowserRouter } from "react-router-dom";
import { Routers } from "ux-autoroute";
import { routeConfig } from "../config/router.js";

var App = function App(_ref) {
    var NoMatch = _ref.NoMatch,
        _before = _ref.before,
        after = _ref.after,
        useHook = _ref.useHook;
    var result = useHook();
    return /*#__PURE__*/ React.createElement(
        BrowserRouter,
        null,
        /*#__PURE__*/ React.createElement(Routers, {
            routers: routeConfig,
            noMatch: NoMatch,
            before: function before(location) {
                if (_before) {
                    return _before(location, result);
                }
            },
            after: after,
        })
    );
};

export var run = function run(_ref2) {
    var modules = _ref2.modules,
        router = _ref2.router;
    ReactDOM.render(
        /*#__PURE__*/ React.createElement(
            ReduxProvider,
            {
                value: modules,
            },
            /*#__PURE__*/ React.createElement(App, router)
        ),
        document.getElementById("root")
    ); // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA

    serviceWorker.unregister();
};
