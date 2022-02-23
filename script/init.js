// 下载github仓库
const download = require("download-git-repo")
// 命令行交互
const { prompt } = require("inquirer")
// 处理模板
const { compile } = require("handlebars");
// loading效果
const ora = require("ora")
// 给字体增加颜色
const { gray, blue } = require("chalk");

const { readFileSync, writeFileSync } = require("fs");

// copySync(
//     join(appPath, ".eslintrc.json"),
//     resolve(__dirname, "../.eslintrc.json")
// );
// copySync(
//     join(appPath, "tsconfig.json"),
//     resolve(__dirname, "../tsconfig.json")
// );
// copySync(join(appSrc, "router.ts"), resolve(__dirname, "../router.js"));
// copySync(path.resolve(paths.appPath, "jsconfig.js"), "../jsconfig.js");

prompt([
    // 输入项目名称
    {
        type: "input",
        name: "name",
        message: "请输入项目名称：",
    },
    // 输入项目描述
    {
        type: "input",
        name: "description",
        message: "请输入项目描述：",
    },
    // 输入项目作者
    {
        type: "input",
        name: "author",
        message: "请输入项目作者：",
    },
    // 选择是否使用node-sass或者less
    // {
    //     type: 'confirm',
    //     name: 'cssStyle',
    //     message: '是否使用less/node-sass：'
    // },
    // // 选择使用node-sass或者less
    // {
    //     type: "list",
    //     message: "请选择以下状态管理机:",
    //     name: "preprocessor",
    //     choices: ["redux", "mobx"],
    // },
    //     // 只有当用户在选择是否使用node-sass或者less时输入了yes才会显示该问题
    //     when: function (answers) {
    //         return answers.cssStyle
    //     }
    // }
]).then((answers) => {
    // 与用户交互完成后，处理用户的选择

    let params = {
        name: answers.name, // 项目名称
        description: answers.description, // 项目描述
        author: answers.author, // 项目作者
        // download: answers.preprocessor === "redux" ? redux : mobx,
    };

    // if (answers.cssStyle) {
    // 	//用户选择使用css预处理器

    //     if (answers.preprocessor === 'less') {
    //     	// 用户选择使用less
    //         params.less = true;
    //         params.sass = false;
    //     } else if (answers.preprocessor === 'sass') {
    //    		// 用户选择使用sass
    //         params.less = false;
    //         params.sass = true;
    //     }
    // } else {
    // 	// 用户选择不使用css预处理器
    //     params.sass = false;
    //     params.less = false
    // }
    // 打印空行，使输出与输出之间有空行，增加体验效果
    console.log("");

    // 提示用户正在下载模板，并显示loading图标
    let spinner = ora("正在下载中...").start();

    // 下载模板到本地
    download(params.download, __dirname, { clone: true }, (err) => {
        if (err) {
            console.log(err);
            spinner.text = "下载失败";
            spinner.fail(); // 下载失败
        } else {
            // 获取模板的package.json的路径
            let packagePath = `${projectName}/package.json`;
            // 读取模板的package.json文件的内容
            let packageStr = readFileSync(packagePath, "utf-8");
            // 根据params参数替换掉模板的package.json文件内容的占位符
            let packages = compile(packageStr)(params);
            // 重新写入文件
            writeFileSync(packagePath, packages);
            // if (params.sass) {
            //     // 由于国内网络原因，node-sass可能需要翻墙才能下载，所以如果用户选择了sass预处理器则需要创建.npmrc文件，并写入node-sass的代理下载地址
            //     const npmrcPath = `${projectName}/.npmrc`;
            //     const appendContent = '\r\nsass_binary_site=https://npm.taobao.org/mirrors/node-sass/'
            //     if (!fs.existsSync(npmrcPath)) {
            //         fs.writeFileSync(npmrcPath, appendContent)
            //     } else {
            //         fs.appendFileSync(npmrcPath, appendContent)
            //     }
            // }
            // 提示用户下载成功
            spinner.text = "下载成功";
            spinner.color = "#13A10E";
            spinner.succeed();
            console.log("");
            // 提示进入下载的目录
            console.log(" 1、 进入项目目录");
            console.log(gray("   $ ") + blue(`cd ${projectName}`));
            console.log("");
            // 提示安装依赖
            console.log(" 2、 安装依赖");
            console.log(
                gray("   $ ") +
                blue(`npm install`) +
                gray("  or  ") +
                blue(`yarn`)
            );
            console.log("");
            // 提示运行开发环境
            console.log(" 3、 运行开发环境指令");
            console.log(
                gray("   $ ") +
                blue(`npm run start`) +
                gray("  or  ") +
                blue(`yarn start`)
            );
            console.log("");
            // 提示打包生产环境代码
            console.log(" 4、 打包生产环境指令");
            console.log(
                gray("   $ ") +
                blue(`npm run build`) +
                gray("  or  ") +
                blue(`yarn build`)
            );
            console.log("");
        }
    });
});
