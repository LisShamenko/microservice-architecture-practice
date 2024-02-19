const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);



// 
let i = 0;

async function cmd(command) {
    try {
        const { stdout, stderr } = await execAsync(command);
        if (stdout) console.log(`${i++} --- stdout: ${stdout}`);
        if (stderr) console.log(`${i++} --- stderr: ${stderr}`);
    }
    catch (err) {
        console.log(`${i++} --- err: ${err}`);
    }
}

async function deleteFolder(path) {
    //await cmd(`if exist \"${path}\" del \"${path}\\*\" /s /q`);
    await cmd(`if exist \"${path}\" rmdir \"${path}\" /s /q`);
}

async function createFolder(path) {
    await cmd(`if not exist \"${path}\" mkdir \"${path}\"`);
}

async function copyFolder(from, to) {
    await cmd('xcopy /s /y \"' + from + '\" \"' + to + '\"');
}

module.exports = {
    cmd, deleteFolder, createFolder, copyFolder,
};
