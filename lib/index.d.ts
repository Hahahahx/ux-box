/// <reference types="react" />

import {
    Routers,
    useRoute,
    RouterView,
} from "ux-autoroute";
import {
    ReduxProvider,
    useModule,
    Action,
    Update,
    SessionStorage,
    LocalStorage,
} from "ux-redux-module";

/**
 * routers 路由映射表对象
 * noMatch 404
 * before 访问路有前触发，如果结果返回了JSX对象的话则替换默认的路由组件
 * after 路由组件生成后触发
 */
interface RunConfig {
    modules: any;
    router: Route;
}

interface Route {
    useHook: () => any;
    NoMatch: () => React.ReactElement | JSX.Element;
    before?: (
        location: Location,
        hookResult?: any
    ) => void | JSX.Element | React.ReactElement;
    after?: (location: Location) => void;
}

declare module "ux-box" {
    /**
     * 启动文件
     * @param params  modules,router 
     * @param params.modules  UserModule 
     * @param params.router 
        NoMatch: () => ReactElement | JSX.Element;
        before?: (
            location: Location
        ) => void | JSX.Element | React.ReactElement;
        after?: (location: Location) => void;
    
     */
    function run(params: RunConfig): void;

    export {
        run,
        Routers,
        RouterView,
        useRoute,
        ReduxProvider,
        useModule,
        Action,
        Update,
        SessionStorage,
        LocalStorage,
    };
}
