/// <reference types="react" />

import {
    Routers,
    useRouter,
    RouterView,
    RouteParams,
    RouterParams,
} from "ux-autoroute";

declare module "ux-box-min" {
    function run(params: RouterParams): void;
    export { run, Routers, RouterView, useRouter };
}
