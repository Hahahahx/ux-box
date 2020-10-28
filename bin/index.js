#!/usr/bin/env node
// 使用node开发命令行工具所执行的js脚本必须在顶部加入 #!/usr/bin/env node 生命
// #!/usr/bin/env node  告诉系统该脚本使用node运行，用户必须在系统变量中配置了node

const { program } = require("commander");
const pakage = require("../package.json");
const spwan = require("cross-spawn");
const path = require("path");
const fs = require("fs");
const paths = require("../config/utils/paths");

//同步拷贝
function copySync(target, source) {
    if (!fs.existsSync(target)) {
        console.log("生成文件..", target);
        //同步读取
        let result = fs.readFileSync(source, "utf8");
        //同步写入
        fs.writeFileSync(target, result);
    }
}

program.version(pakage.version);

program
    .command("start")
    .description("启动webpack...")
    .option("-c --config-file <file>", "配置文件")
    .option("-w --webpack-file <webpack>", "webpack配置文件")
    .action((args) => {
        console.log(args._name);
        todo(args);
    });

program
    .command("build")
    .description("编译项目...")
    .option("-c --config-file <file>", "配置文件")
    .option("-w --webpack-file <webpack>", "webpack配置文件")
    .action((args) => {
        console.log(args._name);
        todo(args);
    });

function todo(args) {
    copySync(
        path.join(paths.appPath, "tsconfig.json"),
        path.resolve(__dirname, "../tsconfig.json")
    );
    copySync(
        path.join(paths.appSrc, "router.ts"),
        path.resolve(__dirname, "../router.js")
    );
    //copySync(path.resolve(paths.appPath, "jsconfig.js"), "../jsconfig.js");
    spwan.sync(
        "node",
        [
            path.resolve(__dirname, `../script/${args._name}.js`),
            JSON.stringify({
                webpackFile: args.webpackFile,
                configFile: args.configFile,
            }),
        ],
        {
            stdio: "inherit",
        }
    );
}

program.on("--help", () => {
    console.log("");
    console.log("Help Options:");
    console.log("-c | --config-file <file>          配置文件");
    console.log("-w | --webpack-file <webpack>      webpack配置文件");
});

program.parse(process.argv);
