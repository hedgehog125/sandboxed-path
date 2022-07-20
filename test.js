const path = require("./index.js");

const testFunction = (fnName, testData) => {
    console.log(`Function: ${fnName}`);
    for (let [index, args] of Object.entries(testData)) {
        if (! Array.isArray(args)) args = [args];
        let display = `Call ${parseInt(index) + 1}/${testData.length} with args: ${JSON.stringify(args)} | `;

        let output;
        try {
            output = path[fnName](...args);
        }
        catch {}

        display += output?? "THREW";
        console.log(display);
    }
    console.log("");
}

console.log(`\nPath of test.js file: ${__dirname}. Default sandbox settings\n`);

testFunction("accessLocal", [
    "",
    "foo",
    "/foo",
    "foo/bar",

    "../",
    "/",
    "C:\\"
]);
testFunction("sandboxPath", [
    __dirname,

    "",
    "../",
    "/",
    "C:\\"
]);
testFunction("accessOutsideLocal", [
    "",
    "foo",
    "/foo",
    "foo/bar",
    "../",
    "/",
    "C:\\",
    __dirname,
    "../",
    "/",
    "C:\\"
]);