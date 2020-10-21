import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { ReduxProvider } from "ux-redux-module";
import { BrowserRouter } from "react-router-dom";
import { Routers } from "ux-autoroute";
import { routeConfig } from "../config/router.js";

export const run = ({
    modules,
    router: { NoMatch, before, after },
}: RunConfig) => {
    ReactDOM.render(
        <ReduxProvider value={modules}>
            <BrowserRouter>
                <Routers
                    routers={routeConfig}
                    noMatch={NoMatch}
                    before={before}
                    after={after}
                />
            </BrowserRouter>
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
    router: {
        NoMatch: () => ReactElement | JSX.Element;
        before?: (
            location: Location
        ) => void | JSX.Element | React.ReactElement;
        after?: (location: Location) => void;
    };
}
