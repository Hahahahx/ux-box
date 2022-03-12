import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { RouterParams, Routers } from "ux-autoroute";

const RouteComponent = (params: RouterParams) => {
    return <Routers {...params} />;
};

export const run = (params: RouterParams) => {
    ReactDOM.render(
        <RouteComponent {...params} />,
        document.getElementById("root")
    );

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
};
