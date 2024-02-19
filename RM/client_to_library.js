const { deleteConsist, copyFolder } = require('./base');
const path = require('path');



// example:
//      npm run client-to-library
//      npm run client-to-library --path="interaction\button\JustButton"
(async () => {
    const subPath = process.env['npm_config_path'] || '';

    const baseLibPath = './../react-library/src/Library';
    const libPath = path.join(baseLibPath, subPath);

    const baseClientPath = './../client-redux/src/library';
    const clientPath = path.join(baseClientPath, subPath);

    console.log('\n--- LIBRARY = ');
    console.log(libPath);
    console.log('\n--- CLIENT = ');
    console.log(clientPath);
    console.log('\n');

    await copyFolder(clientPath, libPath);
})();
