#!/usr/bin/env node
// 使用node开发命令行工具所执行的js脚本必须在顶部加入 #!/usr/bin/env node 生命
// #!/usr/bin/env node  告诉系统该脚本使用node运行，用户必须在系统变量中配置了node

const { program } = require("commander");
const pakage = require("./package.json");
const spwan = require("cross-spawn");
const path = require("path");

program.version(pakage.version);

program
    .command("start")
    .description("执行webpack...")
    .option("-c --config-file <file>", "配置文件")
    .option("-w --webpack-file <webpack>", "webpack配置文件")
    .action((...args) => {
        console.log(args);
        console.log("dosth");
        spwan.sync("node", [path.resolve(__dirname, "./script/start.js")], {
            stdio: "inherit",
        });
    });

program.on("--help", () => {
    console.log("");
    console.log("Help Options:");
    console.log("-c | --config-file <file>          配置文件");
    console.log("-w | --webpack-file <webpack>      webpack配置文件");
});

program.parse(process.argv);
