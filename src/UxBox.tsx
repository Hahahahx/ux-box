import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { Routers } from "ux-autoroute";

const RouteComponent = ({ NoMatch, isHashRouter, router }: Route) => {
    return (
        <Routers
            type={isHashRouter ? "hash" : "history"}
            routers={router}
            noMatch={NoMatch}
        />
    );
};

export const run = ({ router }: RunConfig) => {
    ReactDOM.render(
        <RouteComponent {...router} />,
        document.getElementById("root")
    );

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
};

interface RunConfig {
    router: Route;
}

interface Route {
    router: any;
    isHashRouter?: boolean;
    NoMatch: ReactElement | JSX.Element;
}
