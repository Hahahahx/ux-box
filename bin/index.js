#!/usr/bin/env node
// 使用node开发命令行工具所执行的js脚本必须在顶部加入 #!/usr/bin/env node 生命
// #!/usr/bin/env node  告诉系统该脚本使用node运行，用户必须在系统变量中配置了node

const { program } = require("commander");
const { sync } = require("cross-spawn")
// 用来执行对应的启动脚本
const { resolve } = require("path")
const { version } = require("../package.json")

program.version(version);

program
    .command("start")
    .description("启动webpack...")
    .option("-c --config-file <file>", "配置文件")
    .option("-w --webpack-file <webpack>", "webpack配置文件")
    .action(runScript);

program
    .command("build")
    .description("编译项目...")
    .option("-c --config-file <file>", "配置文件")
    .option("-w --webpack-file <webpack>", "webpack配置文件")
    .action(runScript);

program
    .command("init")
    .description("初始化项目...")
    .option("-c --config-file <file>", "配置文件")
    .action(runScript);

function runScript(args) {
    sync(
        "node",
        [
            resolve(__dirname, `../script/${args._name}.js`),
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

program.parse(process.argv);
