import { Plugin } from 'rollup';

interface Options {
    prefix?: string;
    plugins?: Plugin[];
    uglify?: boolean;
}

export default function worker(opts: Options): Plugin;
