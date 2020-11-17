import { Plugin } from 'rollup';

interface Options {
    prefix?: string;
    plugins?: Plugin[];
    uglify?: boolean;
}

function worker(opts: Options): Plugin;

export { worker };
export default worker;
