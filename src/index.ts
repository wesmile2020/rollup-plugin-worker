import path from 'path';
import * as rollup from 'rollup';
import terser from 'terser';
import { generateUUID } from './utils';

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
    const paths: Map<string, string> = new Map();

    return {
        name: 'rollup-plugin-worker',

        resolveId(source, importer) {
            if (source.startsWith(opts.prefix)) {
                const name = source.slice(opts.prefix.length);
                const id = importer ? path.resolve(path.dirname(importer), name) : name;
                const uuid = generateUUID();
                paths.set(uuid, id);
                return uuid;
            }
            return null;
        },


        load: {
            order: 'post',
            async handler(id) {
                if (!paths.has(id)) return null;
                const builder = await rollup.rollup({
                    input: paths.get(id),
                    plugins: opts.plugins,
                });
                const { output } = await builder.generate({
                    format: 'iife',
                });
                let chunk: rollup.OutputChunk | null = null;
                for (let i = 0; i < output.length; i += 1) {
                    if (output[i].type === 'chunk') {
                        chunk = output[i] as rollup.OutputChunk;
                    }
                }
                let workerCode = '';
                if (chunk) {
                    workerCode = chunk.code;
                    const deps = Object.keys(chunk.modules);
                    for (let i = 0; i < deps.length; i += 1) {
                        this.addWatchFile(deps[i]);
                    }
                }
                if (opts.uglify) {
                    const uglify = await terser.minify(workerCode)
                    workerCode = uglify.code || '';
                }
                const helperPath = path.resolve(__dirname, 'worker-helper');
                const code = [
                    `import createWorker from ${JSON.stringify(helperPath)};`,
                    `export default createWorker(`,
                    JSON.stringify(workerCode),
                    ')',
                ];

                return code.join('\n');
            },
        },
    };
}

export { worker };
export default worker;
