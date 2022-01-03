import path from 'path';
import * as rollup from 'rollup';
import terser from 'terser';

interface Options {
    prefix?: string;
    uglify?: boolean;
    plugins?: [];
}

const defaultOptions = {
    prefix: 'worker!',
    uglify: false,
    plugins: [],
};

function worker(options: Options): rollup.Plugin {
    const opts = { ...defaultOptions, ...options };
    const paths: Set<string> = new Set();

    return {
        name: 'rollup-plugin-worker',

        resolveId(source, importer) {
            if (source.startsWith(opts.prefix)) {
                const name = source.slice(opts.prefix.length);
                if (!importer) return name; 
                const target = path.resolve(path.dirname(importer), name);
                paths.add(target);
                return target;
            }
            return null;
        },

        load(id) {
            if (!paths.has(id)) return null;
            return rollup.rollup({
                input: id,
                plugins: opts.plugins,
            }).then((builder) => {
                return builder.generate({
                    format: 'iife',
                    name: id,
                })
            }).then(async (file) => {
                let chunk: rollup.OutputChunk | null = null;
                for (let i = 0; i < file.output.length; i += 1) {
                    if (file.output[i].type === 'chunk') {
                        chunk = <rollup.OutputChunk>file.output[i];
                    }
                }
                if (!chunk) return null;
                const deps = Object.keys(chunk.modules);
                for (let i = 0; i < deps.length; i += 1) {
                    this.addWatchFile(deps[i]);
                }
                let workerCode = chunk.code;
                if (opts.uglify) {
                    const uglify = await terser.minify(chunk.code);
                    workerCode = uglify.code || '';
                }
                const code = [
                    `import createWorker from 'rollup-plugin-worker/dist/worker-helper';`,
                    `export default createWorker(`,
                    JSON.stringify(workerCode),
                    ')',
                ];
                return Promise.resolve(code.join('\n'));
            });
        }
    }
}

export { worker };
export default worker;
