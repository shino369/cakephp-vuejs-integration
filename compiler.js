import { minify } from 'minify';
import getAllFilesRecursively from './recursiveFiles.js';
import fs from 'fs';
import path from 'path';
const options = {
    js: {
        ecma: 6,
    },
};

async function main() {
    try {
        const files = getAllFilesRecursively('./src') || [];
        console.log('js files found:', files);
        const promises = files.map(async (relPath) => {
            const result = {
                path: relPath,
                source: '',
            };
            try {
                result.source = await minify(relPath, options);
            } catch (error) {
                console.log(error);
            } finally {
                // eslint-disable-next-line no-unsafe-finally
                return result;
            }
        });

        const res = await Promise.all(promises);
        const fileMapping = {};
        res.forEach((file) => {
            const newPath = path.join('./build', file.path);
            const prefix = path.join(...newPath.split(path.sep).slice(0, -1));
            const fileName = newPath.split(path.sep).slice(-1)[0];
            if (!fileName.match(/entry\.js/)) {
                fileMapping[fileName.replace(/\.js/, '')] = path
                    .join('/tms/js/vuejs/', file.path)
                    .replaceAll('\\', '/'); // seems windows php cannot read path use '\\' for some case
            }

            if (!fs.existsSync(prefix)) {
                fs.mkdirSync(prefix, { recursive: true });
            }
            fs.writeFileSync(newPath, file.source);
        });

        console.log('output file mapping json: ', fileMapping);
        fs.writeFileSync(
            './build/src/fileMapping.json',
            JSON.stringify(fileMapping),
        );

        // uncomment this and change the dir to your dir
        // fs.cpSync('./build', '../webroot/js/vuejs/', {
        //     overwrite: true,
        //     recursive: true,
        // });
    } catch (error) {
        console.log(error);
    }
}

main();
