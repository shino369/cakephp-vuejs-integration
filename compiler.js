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
    // enhance features, using module or transpile to plain js es5 should use webpack and babel instead
    try {
        const files =
            getAllFilesRecursively('./src').reduce((accu, pathStr) => {
                if (
                    pathStr
                        .split(path.sep)
                        .slice(-1)[0]
                        .match(/commonUtils\.js/) // must be called first
                ) {
                    return [pathStr, ...accu];
                } else {
                    return [...accu, pathStr];
                }
            }, []) || [];
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
        /**
         * if separate file and create path map
         */
        // const fileMapping = {};
        // res.forEach((file) => {
        //     const newPath = path.join('./build', file.path);
        //     const prefix = path.join(...newPath.split(path.sep).slice(0, -1));
        //     const fileName = newPath.split(path.sep).slice(-1)[0];
        //     if (!fileName.match(/entry\.js/)) {
        //         fileMapping[fileName.replace(/\.js/, '')] = path
        //             .join('/tms/js/vuejs/', file.path)
        //             .replaceAll('\\', '/'); // seems php cannot read path use '\\'
        //     }

        //     if (!fs.existsSync(prefix)) {
        //         fs.mkdirSync(prefix, { recursive: true });
        //     }
        //     fs.writeFileSync(newPath, file.source);
        // });

        // console.log('output file mapping json: ', fileMapping);
        // fs.writeFileSync(
        //     './build/src/fileMapping.json',
        //     JSON.stringify(fileMapping),
        // );

        /**
         * compile to a single file instead
         */

        const concated = res
            .filter(
                (f) =>
                    !f.path
                        .split(path.sep)
                        .slice(-1)[0]
                        .match(/entry\.js/),
            )
            .map((r) => r.source)
            .join('\n');
        if (!fs.existsSync('./build/src/')) {
            fs.mkdirSync('./build/src/', { recursive: true });
        }
        fs.writeFileSync('./build/src/component.js', concated);

        const entry = res.find((f) =>
            f.path
                .split(path.sep)
                .slice(-1)[0]
                .match(/entry\.js/),
        );

        entry && fs.writeFileSync('./build/src/entry.js', entry.source);

        fs.cpSync('./build', '../webroot/js/vuejs/', {
            overwrite: true,
            recursive: true,
        });
    } catch (error) {
        console.log(error);
    }
}

main();
