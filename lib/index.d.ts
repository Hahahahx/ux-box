/// <reference types="react" />

import { Routers, useRouter, RouterView, RouteParams } from "ux-autoroute";

declare namespace Box {
    /**
     * routers 路由映射表对象
     * noMatch 404
     * before 访问路有前触发，如果结果返回了JSX对象的话则替换默认的路由组件
     * after 路由组件生成后触发
     */
    interface RunConfig {
        router: Route;
    }

    interface Route {
        router: Array<RouteParams>;
        isHashRouter?: boolean;
        NoMatch: () => React.ReactElement | JSX.Element;
    }
}

declare module "ux-box-min" {
    /**
     * 启动文件
     * @param params  modules,router 
     * @param params.modules  UserModule 
     * @param params.router 
    
     */
    function run(params: Box.RunConfig): void;

    export { run, Routers, RouterView, useRouter };
}
