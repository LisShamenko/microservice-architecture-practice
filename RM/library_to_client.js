const { deleteFolder, createFolder, copyFolder } = require('./base');
const path = require('path');



// example:
//      npm run library-to-client
//      npm run library-to-client --path="interaction\button\JustButton"
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

    await deleteFolder(clientPath);
    await createFolder(clientPath);
    await copyFolder(libPath, clientPath);

    //      const strs = [
    //          { source: './../react-library/public/fonts', dist: '' },
    //          { source: './../react-library/public/svg', dist: '' },
    //      ];
    //      for (const s of strs) {
    //          await cmd(s);
    //          await createFolder(s.dist);
    //          await copyFolder(s.source, s.dist);
    //      }

})();
