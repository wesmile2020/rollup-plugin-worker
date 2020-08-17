const path = require('path');
const rollup = require('rollup');
const uglify = require('uglify-js');

const defaultOptions = {
    prefix: 'worker!',
    uglify: false,
    plugins: [],
};

function rollupWorker(options = {}) {
    const opts = { ...defaultOptions, ...options };
    const { prefix } = opts;
    const paths = new Set();

    return {
        name: 'rollup-plugin-worker',

        resolveId: function (importee, importer) {
            if (importee.startsWith(prefix)) {
                const name = importee.slice(prefix.length);
                const target = path.resolve(path.dirname(importer), name);
                paths.add(target);
                return target;
            }
        },

        load: function (id) {
            if (paths.has(id)) {
                return rollup.rollup({
                    input: id,
                    plugins: opts.plugins,
                }).then((builder) => {
                    return builder.generate({
                        format: 'iife',
                        name: id,
                    });
                }).then((file) => {
                    let chunk = null;
                    for (let i = 0; i < file.output.length; i += 1) {
                        if (!file.output[i].isAsset) {
                            chunk = file.output[i];
                        }
                    }
                    if (chunk !== null) {
                        const deps = Object.keys(chunk.modules);
                        for (let i = 0; i < deps.length; i += 1) {
                            this.addWatchFile(deps[i]);
                        }
                        const workerCode = opts.uglify ? uglify.minify(chunk.code) : chunk.code;
                        const code = [
                            `import createWorker from 'rollup-plugin-worker/lib/worker-helper'`,
                            `export default createWorker(`,
                            JSON.stringify(workerCode),
                            `)`,
                        ];
                        return Promise.resolve(code.join('\n'));
                    }
                });
            }
        },
    };

}

module.exports = rollupWorker;
