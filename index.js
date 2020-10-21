const { program } = require("commander");
const pakage = require("./package.json");

program.version(pakage.version);

program
    .command("")
    .description("执行webpack...")
    .option("-c --config-file <file>", "配置文件")
    .option("-w --webpack-file <webpack>", "webpack配置文件")
    .action((...args) => {
        console.log(args);
        console.log("dosth");
    });

program.on("--help", () => {
    console.log("");
    console.log("Help Options:");
    console.log("-c | --config-file <file>          配置文件");
    console.log("-w | --webpack-file <webpack>      webpack配置文件");
});

program.parse(process.argv);
