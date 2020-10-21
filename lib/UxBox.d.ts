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
    export { run };
}
