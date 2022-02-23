import url from "url";
import { createRequire } from "module";
import { existsSync, readFileSync, writeFileSync } from "fs";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const getPath = (url2) => {
    const __filename = url.fileURLToPath(url2);
    const __dirname = dirname(__filename);
    return { __filename, __dirname };
};

const { __filename, __dirname } = getPath(import.meta.url);

// 同步拷贝
function copySync(target, source) {
    if (!existsSync(target)) {
        console.warn("生成文件..", target);
        // 同步读取
        let result = readFileSync(source, "utf8");
        // 同步写入
        writeFileSync(target, result);
    }
}

export { __filename, __dirname, version, copySync };
