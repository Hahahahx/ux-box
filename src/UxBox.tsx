import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { ReduxProvider } from "ux-redux-module";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { Routers } from "ux-autoroute";

const App = ({ NoMatch, before, after, useHook, isHashRouter ,router}: Route) => {
    const result = useHook();
    return (
        <Router isHashRouter={isHashRouter}>
            <Routers
                routers={router}
                noMatch={NoMatch}
                before={(location) => {
                    if (before) {
                        return before(location, result);
                    }
                }}
                after={after}
            />
        </Router>
    );
};

const Router = ({ children, isHashRouter }: any) => {
    return isHashRouter ? (
        <HashRouter>{children}</HashRouter>
    ) : (
        <BrowserRouter>{children}</BrowserRouter>
    );
};

export const run = ({ modules, router }: RunConfig) => {
    ReactDOM.render(
        <ReduxProvider value={modules}>
            <App {...router} />
        </ReduxProvider>,
        document.getElementById("root")
    );

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
};

interface RunConfig {
    modules: any;
    router: Route;
}

interface Route {
    router:any
    isHashRouter?: boolean;
    useHook: () => any;
    NoMatch: () => ReactElement | JSX.Element;
    before?: (
        location: Location,
        hookResult?: any
    ) => void | JSX.Element | React.ReactElement;
    after?: (location: Location) => void;
}
